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
        var n=String(scalar(reader,'name') || ('Scene '+(i+1))), bpm=-1;
        try { bpm=Number(scalar(reader,'tempo')); } catch(e) {}
        // Only scenes with a clip on the click track are songs; empty scenes stay out of the setlist.
        if(!slots[i]) continue;
        reader.id=slots[i];
        if(Number(scalar(reader,'has_clip'))===1) fresh.push({id:list[i],index:i,name:n,bpm:bpm});
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
function refresh() { try { if(!ready) init(); else scan(); } catch(e) { announce('Refresh failed: '+e.message); } }
function poll() {
    if(!ready) return;
    try {
        if(++tick%8===0) scan();
        var playing=Number(scalar(song,'is_playing'))===1;
        var slot=Number(scalar(track,'playing_slot_index'));
        var live=-1; for(var k=0;k<scenes.length;k++) if(scenes[k].index===slot) live=k;
        if(playing && live>=0) {
            currentId=scenes[live].id;
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
    if(Date.now()>noteUntil) ui('status',pi>=0 ? 'PENDING: '+scenes[pi].name : (playing && slot>=0?'PLAYING':'STOPPED'));
    ui('page','SETLIST  /  '+(page+1)+' of '+Math.max(1,Math.ceil(scenes.length/ROWS)));
    for(var r=0;r<ROWS;r++) {
        var s=scenes[page*ROWS+r];
        button('row'+r,s ? ((s.id===currentId?' > ':'   ')+(page*ROWS+r+1)+'. '+s.name+'   /   '+bpmText(s)) : '');
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
function choose(r) { if(allowed()) fireIndex(page*ROWS+Number(r)); }
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
        // Insert right after the last song, so the setlist stays at the top and empty scenes below.
        var i=scenes.length ? scenes[scenes.length-1].index+1 : 0;
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
        scan(); page=Math.floor((scenes.length-1)/ROWS);
        announce('Added: '+newName+' / '+newBpm+' BPM'+(newAccent?'':' / no accent'));
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
    try {
        writeScene(s.id);
        reader.id=ids(track.get('clip_slots'))[s.index];
        downbeats(ids(reader.get('clip'))[0]);
        scan(); announce('Updated: '+newName+' / '+newBpm+' BPM'+(newAccent?'':' / no accent'));
    }
    catch(e) { announce('Update failed: '+e.message); }
}
function notifydeleted() { if(poller) poller.cancel(); ready=false; }
