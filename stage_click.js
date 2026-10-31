autowatch = 1;
inlets = 1;
outlets = 0;
// Live 11/12, legacy Max js. UI only; audio stays in Live.
var song, track, view, reader, poller;
var scenes = [], currentId = 0, pendingId = 0, page = 0;
var pendingAt = 0, lastPress = 0, tick = 0, ready = false;
var note = '', noteUntil = 0;
var ROWS = 8;
var newName = '', newBpm = 120, newAccent = true;
var editMode = false, deleteId = 0, deleteAt = 0;
var ACCENT = 36, BEAT = 37; // C1 = accent, C#1 = beat (the device plays any non-C1 note as beat)
function ui(name, text) {
    var o = this.patcher.getnamed(name);
    if (o) o.message('set', String(text));
}
function button(name, text) {
    var o = this.patcher.getnamed(name);
    if (o) o.message('text', String(text));
}
function scalar(api, prop) { var a = api.get(prop); return Array.isArray(a) ? a[0] : a; }
function ids(a) {
    var r = []; for (var i=0; i<a.length; i++) if (a[i] === 'id' && i+1<a.length) r.push(Number(a[++i]));
    return r;
}
function at(id) { for (var i=0;i<scenes.length;i++) if(scenes[i].id===Number(id)) return i; return -1; }
function announce(s) { note=s; noteUntil=Date.now()+3500; ui('status',s); }
function init() {
    if (poller) poller.cancel();
    ready=false;
    try {
        song=new LiveAPI(null,'live_set');
        track=new LiveAPI(null,'this_device canonical_parent');
        view=new LiveAPI(null,'live_set view');
        reader=new LiveAPI(null,'live_set');
        if (!song.id || track.type !== 'Track') throw new Error('Place the device directly on the click MIDI track, outside any Rack.');
        ready=true;
        scan();
        poller=new Task(poll,this); poller.interval=250; poller.repeat();
        announce('Connected - pick a song or START');
    } catch(e) { ui('status','Connection: '+e.message); }
}
function scan() {
    if(!ready) return;
    var list=ids(song.get('scenes')), fresh=[], slots=ids(track.get('clip_slots'));
    for(var i=0;i<list.length;i++) {
        reader.id=list[i];
        var n=String(scalar(reader,'name') || ('Scene '+(i+1))), bpm=-1, last=fresh[fresh.length-1];
        try { bpm=Number(scalar(reader,'tempo')); } catch(e) {}
        // A scene named '+...' right below a song (or its parts) is a part of that song, not a song of its own.
        if(n.charAt(0)==='+') {
            if(last && lastIndex(last)===i-1) last.parts.push({id:list[i],index:i,name:partName(n)});
            continue;
        }
        // Only scenes with a clip on the click track are songs; empty scenes stay out of the setlist.
        if(!slots[i]) continue;
        reader.id=slots[i];
        if(Number(scalar(reader,'has_clip'))===1) fresh.push({id:list[i],index:i,name:n,bpm:bpm,parts:[]});
    }
    scenes=fresh;
    if(at(currentId)<0) {
        var selected=ids(view.get('selected_scene'));
        currentId=selected.length && at(selected[0])>=0 ? selected[0] : (scenes.length?scenes[0].id:0);
    }
    if(pendingId && at(pendingId)<0) pendingId=0;
    page=Math.min(page,Math.max(0,Math.ceil(scenes.length/ROWS)-1));
    render();
}
function partName(n) { return n.slice(1).trim() || 'Part'; }
function lastIndex(s) { return s.parts.length ? s.parts[s.parts.length-1].index : s.index; }
// Song and part (0 = the song's own scene) playing in scene slot i, or null.
function playingAt(i) {
    for(var k=0;k<scenes.length;k++) {
        if(scenes[k].index===i) return {song:k,part:0};
        for(var q=0;q<scenes[k].parts.length;q++) if(scenes[k].parts[q].index===i) return {song:k,part:q+1};
    }
    return null;
}
function refresh() { try { if(!ready) init(); else scan(); } catch(e) { announce('Refresh failed: '+e.message); } }
function poll() {
    if(!ready) return;
    try {
        if(++tick%8===0) scan();
        var playing=Number(scalar(song,'is_playing'))===1;
        var slot=Number(scalar(track,'playing_slot_index'));
        var live=playingAt(slot);
        if(playing && live) {
            currentId=scenes[live.song].id;
            if(currentId===pendingId) pendingId=0;
        }
        if(pendingId && Date.now()-pendingAt>15000) { pendingId=0; announce('Launch not confirmed - check the click track'); }
        render();
    } catch(e) { ui('status','Connection lost - click REFRESH'); }
}
function bpmText(s) { return s && s.bpm>0 ? String(Math.round(s.bpm*100)/100) : 'GLOBAL'; }
function render() {
    var ci=at(currentId), pi=at(pendingId), current=scenes[ci];
    var playing=ready && Number(scalar(song,'is_playing'))===1;
    var slot=ready ? Number(scalar(track,'playing_slot_index')) : -1;
    ui('song',current?current.name:'No scene');
    ui('bpm',playing && slot>=0 ? String(Math.round(Number(scalar(song,'tempo'))*100)/100) : bpmText(current));
    ui('position',ci>=0 ? ('SONG '+(ci+1)+' / '+scenes.length) : 'SETLIST');
    ui('nexttitle',ci>=0 && ci+1<scenes.length ? 'Next: '+scenes[ci+1].name : 'End of setlist');
    var live=playing ? playingAt(slot) : null;
    if(Date.now()>noteUntil) ui('status',pi>=0 ? 'PENDING: '+scenes[pi].name : live && current && current.parts.length ? 'PLAYING  /  PART '+(live.part+1)+' of '+(current.parts.length+1)+(live.part?': '+current.parts[live.part-1].name:'') : (playing && slot>=0?'PLAYING':editMode?'EDIT SETLIST: click a title, then MOVE UP / MOVE DOWN / DELETE':'STOPPED'));
    ui('page','SETLIST  /  '+(page+1)+' of '+Math.max(1,Math.ceil(scenes.length/ROWS)));
    for(var r=0;r<ROWS;r++) {
        var s=scenes[page*ROWS+r];
        button('row'+r,s ? ((s.id===currentId?' > ':'   ')+(page*ROWS+r+1)+'. '+s.name+'   /   '+bpmText(s)+(s.parts.length?'   /   '+(s.parts.length+1)+' parts':'')) : '');
    }
    ui('trackname',ready?'Tracking: '+String(scalar(track,'name')):'');
}
function allowed() {
    if(!ready) { announce('Click REFRESH to connect'); return false; }
    if(pendingId) { announce('Launch pending - STOP to cancel'); return false; }
    if(Date.now()-lastPress<400) return false;
    lastPress=Date.now(); return true;
}
function fireIndex(i) {
    if(i<0 || i>=scenes.length) { announce(i<0?'First song':'End of setlist'); return; }
    try {
        reader.id=scenes[i].id;
        reader.call('fire');
        pendingId=scenes[i].id; pendingAt=Date.now(); noteUntil=0;
        page=Math.floor(i/ROWS); render();
    } catch(e) { pendingId=0; announce('Launch failed: '+e.message); }
}
function next() { if(allowed()) fireIndex(at(currentId)+1); }
function previous() { if(allowed()) fireIndex(at(currentId)-1); }
function start() { if(allowed()) fireIndex(at(currentId)); }
function choose(r) {
    var i=page*ROWS+Number(r);
    // In edit mode a title is only selected, never launched.
    if(editMode) { if(scenes[i]) { currentId=scenes[i].id; noteUntil=0; render(); } return; }
    if(allowed()) fireIndex(i);
}
function stop() {
    if(!ready) return;
    try {
        // Stop queued clips as well, so a pending launch cannot restart playback.
        song.call('stop_all_clips',0); song.call('stop_playing');
        pendingId=0; noteUntil=0; render();
    } catch(e) { announce('Stop failed: '+e.message); }
}
function pageup() { page=Math.max(0,page-1); render(); }
function pagedown() { page=Math.min(Math.max(0,Math.ceil(scenes.length/ROWS)-1),page+1); render(); }
// Setlist editor: fields send 'text <name>' and 'bpm <n>' right before add/update.
function text() { newName=Array.prototype.slice.call(arguments).join(' ').trim(); }
function bpm(v) { newBpm=Number(v); }
function noaccent(v) { newAccent=!Number(v); }
function entryOk() {
    if(!ready) { announce('Click REFRESH to connect'); return false; }
    if(!newName) { announce('Type a song name'); return false; }
    if(!(newBpm>=20 && newBpm<=999)) { announce('BPM must be between 20 and 999'); return false; }
    return true;
}
function writeScene(id) {
    reader.id=id; reader.set('name',newName); reader.set('tempo_enabled',1); reader.set('tempo',newBpm);
}
function add() {
    if(!entryOk()) return;
    try {
        // A name starting with '+' adds a part at the end of the current song.
        var part=newName.charAt(0)==='+', host=scenes[at(currentId)];
        if(part && !host) { announce('Pick the song to add the part to'); return; }
        // Insert right after the last song (or the current song's last part), so the setlist stays at the top and empty scenes below.
        var i=part ? lastIndex(host)+1 : scenes.length ? lastIndex(scenes[scenes.length-1])+1 : 0;
        song.call('create_scene',i);
        writeScene(ids(song.get('scenes'))[i]);
        // One looped 4/4 bar: plain beats on 2-4, beat 1 set by downbeats().
        reader.id=ids(track.get('clip_slots'))[i];
        reader.call('create_clip',4);
        reader.id=ids(reader.get('clip'))[0];
        reader.set('name',newName); reader.set('looping',1);
        reader.call('add_new_notes',{notes:[
            {pitch:BEAT,start_time:1,duration:0.25,velocity:100},
            {pitch:BEAT,start_time:2,duration:0.25,velocity:100},
            {pitch:BEAT,start_time:3,duration:0.25,velocity:100}]});
        downbeats(reader.id);
        scan(); if(!part) page=Math.floor((scenes.length-1)/ROWS);
        announce((part?'Added part to '+host.name+': ':'Added: ')+newName+' / '+newBpm+' BPM'+(newAccent?'':' / no accent'));
    } catch(e) { announce('Add failed: '+e.message); scan(); }
}
// Rewrites the click note on beat 1 of every 4/4 bar: C1 (accent) or C#1 (plain). Other notes are left alone.
function downbeats(clipId) {
    reader.id=clipId;
    var notes=[], len=Number(scalar(reader,'length'));
    for(var b=0;b<len;b+=4) {
        reader.call('remove_notes_extended',ACCENT,2,b,0.01);
        notes.push({pitch:newAccent?ACCENT:BEAT,start_time:b,duration:0.25,velocity:newAccent?127:100});
    }
    reader.call('add_new_notes',{notes:notes});
}
function update() {
    if(!entryOk()) return;
    var s=scenes[at(currentId)];
    if(!s) { announce('No current song'); return; }
    if(newName.charAt(0)==='+') { announce('UPDATE CURRENT edits the song itself: edit its parts in Live'); return; }
    try {
        writeScene(s.id);
        reader.id=ids(track.get('clip_slots'))[s.index];
        downbeats(ids(reader.get('clip'))[0]);
        scan(); announce('Updated: '+newName+' / '+newBpm+' BPM'+(newAccent?'':' / no accent'));
    }
    catch(e) { announce('Update failed: '+e.message); }
}
// Setlist edit mode: MOVE UP / MOVE DOWN / DELETE act on the current song, transport stopped only.
function editmode(v) {
    editMode=!!Number(v); deleteId=0;
    announce(editMode?'Edit mode: titles select instead of launch':'Edit mode off: titles launch songs');
}
function editOk() {
    if(!ready) { announce('Click REFRESH to connect'); return null; }
    if(!editMode) { announce('Turn on EDIT SETLIST first'); return null; }
    if(pendingId || Number(scalar(song,'is_playing'))===1) { announce('Stop playback before editing the setlist'); return null; }
    var s=scenes[at(currentId)];
    if(!s) announce('No current song');
    return s || null;
}
function moveClip(from,to) {
    reader.id=from;
    if(Number(scalar(reader,'has_clip'))===1) { reader.call('duplicate_clip_to','id',to); return; }
    reader.id=to;
    if(Number(scalar(reader,'has_clip'))===1) reader.call('delete_clip');
}
var SCENE_PROPS=['name','color','tempo','time_signature_numerator','time_signature_denominator','tempo_enabled','time_signature_enabled'];
// Live has no API to move a scene: rewrite rows start.. so that row start+r gets the content of scene row order[r].
// Clips move on every track through temporary scenes added at the end; scene settings are copied over. Unchanged rows are skipped.
function permute(start,order) {
    var n=order.length, base=ids(song.get('scenes')).length, t=new LiveAPI(null,'live_set'), r, k, p;
    for(r=0;r<n;r++) song.call('create_scene',-1);
    try {
        var tracks=ids(song.get('tracks'));
        for(k=0;k<tracks.length;k++) {
            t.id=tracks[k];
            var slots=ids(t.get('clip_slots'));
            if(slots.length<base+n) continue;
            for(r=0;r<n;r++) if(order[r]!==start+r) moveClip(slots[start+r],slots[base+r]);
            for(r=0;r<n;r++) if(order[r]!==start+r) moveClip(slots[base+order[r]-start],slots[start+r]);
        }
        var list=ids(song.get('scenes')), saved=[];
        for(r=0;r<n;r++) {
            saved.push({}); reader.id=list[start+r];
            for(p=0;p<SCENE_PROPS.length;p++) try { saved[r][SCENE_PROPS[p]]=scalar(reader,SCENE_PROPS[p]); } catch(e) {}
        }
        // Some properties are missing in Live 11 or refuse -1 (no tempo): skip those, the enabled flags follow.
        for(r=0;r<n;r++) {
            if(order[r]===start+r) continue;
            reader.id=list[start+r];
            for(p=0;p<SCENE_PROPS.length;p++) if(SCENE_PROPS[p] in saved[order[r]-start]) try { reader.set(SCENE_PROPS[p],saved[order[r]-start][SCENE_PROPS[p]]); } catch(e) {}
        }
    } finally { for(r=n-1;r>=0;r--) song.call('delete_scene',base+r); }
}
function range(a,b) { var r=[]; for(var i=a;i<=b;i++) r.push(i); return r; }
function move(step) {
    var s=editOk(); if(!s) return;
    var i=at(s.id), j=i+step;
    if(j<0 || j>=scenes.length) { announce(j<0?'Already first':'Already last'); return; }
    try {
        // Swap the two songs as whole blocks (song + parts); empty scenes between them stay between them.
        var lo=scenes[Math.min(i,j)], hi=scenes[Math.max(i,j)], gap=range(lastIndex(lo)+1,hi.index-1);
        var order=range(hi.index,lastIndex(hi)).concat(gap,range(lo.index,lastIndex(lo)));
        permute(lo.index,order);
        var row=step<0 ? lo.index : lo.index+order.length-(lastIndex(lo)-lo.index+1);
        currentId=ids(song.get('scenes'))[row]; scan(); page=Math.floor(j/ROWS); render();
        announce('Moved: '+s.name+' to position '+(j+1));
    } catch(e) { announce('Move failed: '+e.message); scan(); }
}
function moveup() { move(-1); }
function movedown() { move(1); }
// DELETE removes the song's scene and its parts (every track's clip in them), so it asks for a second press within 4 s.
function remove() {
    var s=editOk(); if(!s) return;
    if(deleteId!==s.id || Date.now()-deleteAt>4000) {
        deleteId=s.id; deleteAt=Date.now();
        announce('Press DELETE again to remove '+s.name); return;
    }
    deleteId=0;
    try {
        var i=at(s.id), keep=scenes[i+1]||scenes[i-1];
        for(var d=lastIndex(s);d>=s.index;d--) song.call('delete_scene',d);
        currentId=keep?keep.id:0; scan();
        announce('Deleted: '+s.name);
    } catch(e) { announce('Delete failed: '+e.message); scan(); }
}
function notifydeleted() { if(poller) poller.cancel(); ready=false; }
