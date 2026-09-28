autowatch = 1;
inlets = 1;
outlets = 0;
// Live 11/12, legacy Max js. UI only; audio stays in Live.
var song, track, view, reader, poller;
var scenes = [], currentId = 0, pendingId = 0, page = 0;
var pendingAt = 0, lastPress = 0, tick = 0, ready = false;
var note = '', noteUntil = 0;
var ROWS = 8;
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
        if (!song.id || track.type !== 'Track') throw new Error('Placer le device directement sur la piste MIDI du clic, hors Rack.');
        ready=true;
        scan();
        poller=new Task(poll,this); poller.interval=250; poller.repeat();
        announce('Connecte - choisir un morceau ou DEMARRER');
    } catch(e) { ui('status','Connexion : '+e.message); }
}
function scan() {
    if(!ready) return;
    var list=ids(song.get('scenes')), fresh=[], slots=ids(track.get('clip_slots'));
    for(var i=0;i<list.length;i++) {
        reader.id=list[i];
        var n=String(scalar(reader,'name') || ('Scene '+(i+1))), bpm=-1;
        try { bpm=Number(scalar(reader,'tempo')); } catch(e) {}
        var has=false;
        if(slots[i]) { reader.id=slots[i]; has=Number(scalar(reader,'has_clip'))===1; }
        fresh.push({id:list[i],index:i,name:n,bpm:bpm,has:has});
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
function refresh() { try { if(!ready) init(); else scan(); } catch(e) { announce('Actualisation impossible : '+e.message); } }
function poll() {
    if(!ready) return;
    try {
        if(++tick%8===0) scan();
        var playing=Number(scalar(song,'is_playing'))===1;
        var slot=Number(scalar(track,'playing_slot_index'));
        if(playing && slot>=0 && scenes[slot]) {
            currentId=scenes[slot].id;
            if(currentId===pendingId) pendingId=0;
        }
        if(pendingId && Date.now()-pendingAt>15000) { pendingId=0; announce('Lancement non confirme - verifier la piste du clic'); }
        render();
    } catch(e) { ui('status','Connexion interrompue - cliquer ACTUALISER'); }
}
function bpmText(s) { return s && s.bpm>0 ? String(Math.round(s.bpm*100)/100) : 'GLOBAL'; }
function render() {
    var ci=at(currentId), pi=at(pendingId), current=scenes[ci];
    var playing=ready && Number(scalar(song,'is_playing'))===1;
    var slot=ready ? Number(scalar(track,'playing_slot_index')) : -1;
    ui('song',current?current.name:'Aucune scene');
    ui('bpm',playing && slot>=0 ? String(Math.round(Number(scalar(song,'tempo'))*100)/100) : bpmText(current));
    ui('position',ci>=0 ? ('MORCEAU '+(ci+1)+' / '+scenes.length) : 'SETLIST');
    ui('nexttitle',ci>=0 && ci+1<scenes.length ? 'Ensuite : '+scenes[ci+1].name : 'Fin de la setlist');
    if(Date.now()>noteUntil) ui('status',pi>=0 ? 'EN ATTENTE : '+scenes[pi].name : (playing && slot>=0?'LECTURE':'ARRET'));
    ui('page','SETLIST  /  '+(page+1)+' sur '+Math.max(1,Math.ceil(scenes.length/ROWS)));
    for(var r=0;r<ROWS;r++) {
        var s=scenes[page*ROWS+r];
        button('row'+r,s ? ((s.id===currentId?' > ':'   ')+(s.index+1)+'. '+s.name+'   /   '+bpmText(s)+(s.has?'':'  [sans clic]')) : '');
    }
    ui('trackname',ready?'Piste suivie : '+String(scalar(track,'name')):'');
}
function allowed() {
    if(!ready) { announce('Cliquer ACTUALISER pour se connecter'); return false; }
    if(pendingId) { announce('Lancement en attente - STOP pour annuler'); return false; }
    if(Date.now()-lastPress<400) return false;
    lastPress=Date.now(); return true;
}
function fireIndex(i) {
    if(i<0 || i>=scenes.length) { announce(i<0?'Premier morceau':'Fin de la setlist'); return; }
    if(!scenes[i].has) { announce('Aucun clip de clic sur cette scene'); return; }
    try {
        reader.id=scenes[i].id;
        reader.call('fire');
        pendingId=scenes[i].id; pendingAt=Date.now(); noteUntil=0;
        page=Math.floor(i/ROWS); render();
    } catch(e) { pendingId=0; announce('Lancement impossible : '+e.message); }
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
    } catch(e) { announce('Arret impossible : '+e.message); }
}
function pageup() { page=Math.max(0,page-1); render(); }
function pagedown() { page=Math.min(Math.max(0,Math.ceil(scenes.length/ROWS)-1),page+1); render(); }
function notifydeleted() { if(poller) poller.cancel(); ready=false; }
