const fs=require('fs'),vm=require('vm'),assert=require('assert');
let model={scenes:[{id:10,name:'Stream',bpm:120,has:1},{id:11,name:'Fantasy',bpm:135,has:1},{id:12,name:'Empty',bpm:105,has:0}],playing:0,slot:-1,selected:10,tempo:120,calls:[],clips:{}};
class API {
 constructor(cb,path){this.path=path;this.id=path==='live_set'?1:path==='this_device canonical_parent'?2:3;this.type=path==='this_device canonical_parent'?'Track':'Song';}
 get(prop){let s=model.scenes.find(s=>s.id===this.id);
 if(this.id>=1000&&prop==='length')return [model.clips[this.id-1000].length];
 if(prop==='name')return [s?s.name:'CLIC'];
 if(prop==='tempo')return [s?s.bpm:model.tempo];
 if(prop==='scenes')return model.scenes.flatMap(s=>['id',s.id]);
 if(prop==='clip_slots')return model.scenes.flatMap((s,i)=>['id',100+i]);
 if(prop==='has_clip')return [model.scenes[this.id-100].has];
 if(prop==='clip')return ['id',1000+this.id-100];
 if(prop==='selected_scene')return ['id',model.selected];
 if(prop==='is_playing')return [model.playing];
 if(prop==='playing_slot_index')return [model.slot];throw new Error(prop);}
 set(prop,v){const t=this.id>=1000?model.clips[this.id-1000]:model.scenes.find(s=>s.id===this.id);t[prop==='tempo'?'bpm':prop]=v;}
 call(fn,arg){model.calls.push([fn,arg]);if(fn==='create_scene')model.scenes.splice(arg,0,{id:20+model.scenes.length,name:'',bpm:-1,has:0});
 if(fn==='create_clip'){model.scenes[this.id-100].has=1;model.clips[this.id-100]={length:arg};}const cl=model.clips[this.id-1000];if(fn==='add_new_notes')cl.notes=(cl.notes||[]).concat(arg.notes);
 if(fn==='remove_notes_extended'){const [p0,ps,t0,ts]=[...arguments].slice(1);cl.notes=(cl.notes||[]).filter(n=>!(n.pitch>=p0&&n.pitch<p0+ps&&n.start_time>=t0&&n.start_time<t0+ts));}if(fn==='fire'){model.slot=model.scenes.findIndex(s=>s.id===this.id);model.playing=1;model.tempo=model.scenes[model.slot].bpm;}if(fn==='stop_playing')model.playing=0;if(fn==='stop_all_clips')model.slot=-1;}
}
const ui={};const c={LiveAPI:API,Task:function(){this.cancel=()=>{};this.repeat=()=>{};},Date,Math,Number,String,Error,patcher:{getnamed:n=>({message:(k,v)=>ui[n]=v})}};
vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/stage_click.js','utf8'),c);
c.init();assert.equal(c.currentId,10);
// A scene with no click clip (e.g. Live's default empty scenes) is not part of the setlist.
assert.deepEqual(c.scenes.map(s=>s.id),[10,11]);
c.start();c.poll();assert.equal(model.tempo,120);assert.equal(c.pendingId,0);
c.stop();assert.equal(model.playing,0);
c.lastPress=0;c.next();c.poll();assert.equal(c.currentId,11);assert.equal(model.tempo,135);
c.lastPress=0;c.next();assert.equal(c.currentId,11);assert(ui.status.includes('End'));
c.lastPress=0;c.previous();c.poll();assert.equal(c.currentId,10);
c.lastPress=0;c.previous();assert.equal(c.currentId,10);assert(ui.status.includes('First'));
// Actual playback, not selected scene, drives the current title.
model.slot=1;model.playing=1;model.selected=10;c.poll();assert.equal(c.currentId,11);
c.pendingId=10;c.stop();assert.equal(c.pendingId,0);assert.equal(model.playing,0);
model.scenes[2].has=1;c.scan();c.lastPress=0;c.next();c.poll();assert.equal(c.currentId,12);
c.lastPress=0;let count=model.calls.length;c.next();assert.equal(model.calls.length,count);assert(ui.status.includes('End'));
// Stable scene IDs survive reordering.
model.playing=0;model.scenes.reverse();c.scan();assert.equal(c.currentId,12);assert.equal(c.at(12),0);
// Setlist editor: add appends a named, tempo'd scene with a 1-bar click clip; update edits the current one.
model.scenes.push({id:30,name:'',bpm:-1,has:0});c.scan();assert.equal(c.scenes.length,3);
c.text();c.add();assert(ui.status.includes('Type a song name'));c.text('X');c.bpm(5);c.add();assert(ui.status.includes('BPM'));assert.equal(model.scenes.length,4);
c.text('New','Song',2);c.bpm(128);c.add();let s=model.scenes[3],clip=model.clips[3];
assert.equal(s.name,'New Song 2');assert.equal(s.bpm,128);assert.equal(s.tempo_enabled,1);assert.equal(c.scenes[3].name,'New Song 2');assert.equal(model.scenes[4].id,30);// inserted after the last song, before the empty scene
assert.equal(clip.length,4);assert.equal(clip.looping,1);const beats=cl=>cl.notes.map(n=>[n.pitch,n.start_time]).sort((a,b)=>a[1]-b[1]);
assert.deepEqual(beats(clip),[[36,0],[37,1],[37,2],[37,3]]);
c.text('Renamed');c.bpm(99);c.update();assert.equal(model.scenes[0].name,'Renamed');assert.equal(model.scenes[0].bpm,99);assert.equal(c.currentId,12);
// Per-song accent: off writes C#1 on beat 1; UPDATE rewrites only the downbeats of every bar.
c.noaccent(1);c.text('Flat');c.bpm(90);c.add();const flat=model.clips[4];assert.deepEqual(beats(flat),[[37,0],[37,1],[37,2],[37,3]]);assert(ui.status.includes('no accent'));
flat.length=8;flat.notes.push({pitch:37,start_time:4},{pitch:37,start_time:5});c.currentId=model.scenes[4].id;c.noaccent(0);c.update();
assert.deepEqual(beats(flat),[[37,1],[37,2],[37,3],[37,5],[36,0],[36,4]].sort((a,b)=>a[1]-b[1]));
// Edit mode on a two-track set (click track 2 + backing track 5). Clip slot id = 10000 + track*100 + scene index.
const sc=(id,name,bpm)=>({id,name,tempo:bpm,tempo_enabled:1,color:id});
let m={scenes:[sc(40,'A',120),sc(41,'B',135),sc(42,'Gap',100),sc(43,'D',90)],clips:{2:['a','b',null,'d'],5:['A','B','x',null]},playing:0,slot:-1,next:50,calls:[]};
const TR=[2,5],slotOf=id=>({t:TR[Math.floor((id-10000)/100)],i:(id-10000)%100});
class API2 {
 constructor(cb,path){this.id=path==='live_set'?1:path==='this_device canonical_parent'?2:3;this.type=path==='this_device canonical_parent'?'Track':'Song';}
 get(prop){const s=m.scenes.find(s=>s.id===this.id);
  if(prop==='scenes')return m.scenes.flatMap(s=>['id',s.id]);
  if(prop==='tracks')return TR.flatMap(t=>['id',t]);
  if(prop==='clip_slots')return m.scenes.flatMap((s,i)=>['id',10000+TR.indexOf(this.id)*100+i]);
  if(prop==='has_clip'){const o=slotOf(this.id);return [m.clips[o.t][o.i]?1:0];}
  if(s)return [s[prop]];
  if(prop==='selected_scene')return ['id',40];if(prop==='is_playing')return [m.playing];if(prop==='playing_slot_index')return [m.slot];
  if(prop==='name')return ['CLIC'];if(prop==='tempo')return [120];throw new Error(prop);}
 set(prop,v){m.scenes.find(s=>s.id===this.id)[prop]=v;}
 call(fn,...a){m.calls.push(fn);
  if(fn==='create_scene'){const i=a[0]<0?m.scenes.length:a[0];m.scenes.splice(i,0,sc(m.next++,'',-1));TR.forEach(t=>m.clips[t].splice(i,0,null));}
  if(fn==='delete_scene'){m.scenes.splice(a[0],1);TR.forEach(t=>m.clips[t].splice(a[0],1));}
  if(fn==='duplicate_clip_to'){assert.equal(a[0],'id');const f=slotOf(this.id),t=slotOf(a[1]);m.clips[t.t][t.i]=m.clips[f.t][f.i];}
  if(fn==='delete_clip'){const o=slotOf(this.id);m.clips[o.t][o.i]=null;}
  if(fn==='fire'){m.playing=1;m.slot=m.scenes.findIndex(s=>s.id===this.id);}}
}
const ui2={},e={LiveAPI:API2,Task:function(){this.cancel=()=>{};this.repeat=()=>{};},Date,Math,Number,String,Error,patcher:{getnamed:n=>({message:(k,v)=>ui2[n]=v})}};
vm.createContext(e);vm.runInContext(fs.readFileSync(__dirname+'/stage_click.js','utf8'),e);
e.init();assert.deepEqual(e.scenes.map(s=>s.name),['A','B','D']);// 'Gap' has no click clip
const names=()=>m.scenes.map(s=>s.name),row=t=>m.clips[t].join();
e.choose(1);e.moveup();assert(ui2.status.includes('EDIT SETLIST first'));assert.deepEqual(names(),['A','B','Gap','D']);
m.playing=1;e.editmode(1);e.moveup();assert(ui2.status.includes('Stop playback'));m.playing=0;e.pendingId=0;
// In edit mode a title selects without launching.
let fires=m.calls.filter(f=>f==='fire').length;e.choose(1);assert.equal(e.currentId,41);assert.equal(m.calls.filter(f=>f==='fire').length,fires);
e.moveup();assert.deepEqual(names(),['B','A','Gap','D']);assert.equal(row(2),'b,a,,d');assert.equal(row(5),'B,A,x,');
assert.deepEqual(m.scenes.map(s=>s.tempo),[135,120,100,90]);assert.equal(m.scenes.length,4);// temporary scene removed
assert.equal(e.at(e.currentId),0);assert.equal(e.scenes[0].name,'B');e.moveup();assert(ui2.status.includes('Already first'));
// Songs on both sides of an empty scene swap without touching it.
e.choose(1);e.movedown();assert.deepEqual(names(),['B','D','Gap','A']);assert.equal(row(2),'b,d,,a');assert.equal(row(5),'B,,x,A');assert.equal(e.scenes[2].name,'A');
e.movedown();assert(ui2.status.includes('Already last'));
// DELETE needs a second press on the same song, then removes the scene and its clips on every track.
e.remove();assert(ui2.status.includes('again'));assert.equal(m.scenes.length,4);e.choose(0);e.remove();assert.equal(m.scenes.length,4);
e.choose(2);e.remove();assert.equal(m.scenes.length,4);e.remove();assert.deepEqual(names(),['B','D','Gap']);assert.equal(row(5),'B,,x');
assert.deepEqual(e.scenes.map(s=>s.name),['B','D']);assert.equal(e.scenes[e.at(e.currentId)].name,'D');
e.editmode(0);e.lastPress=0;e.choose(0);assert.equal(m.playing,1);// edit off: titles launch again
// Song parts: '+' scenes right below a song belong to it; after an empty scene, a '+' scene is an orphan and ignored.
m={scenes:[sc(60,'A',120),sc(61,'+A2',150),sc(62,'+ A3',140),sc(63,'B',100),sc(64,'Gap',-1),sc(65,'+orphan',-1),sc(66,'C',90)],
 clips:{2:['a','a2','a3','b',null,null,'c'],5:['A','A2',null,'B','x',null,'C']},playing:0,slot:-1,next:70,calls:[]};
e.init();assert.deepEqual(e.scenes.map(s=>s.name),['A','B','C']);assert.deepEqual(e.scenes[0].parts.map(q=>q.name),['A2','A3']);
// Playing a part (e.g. reached by a scene Follow Action) keeps its song current and shows which part.
m.playing=1;m.slot=2;e.currentId=63;e.pendingId=0;e.noteUntil=0;e.poll();assert.equal(e.currentId,60);assert(ui2.status.includes('PART 3 of 3: A3'));assert(ui2.row0.includes('3 parts'));
e.lastPress=0;e.next();assert.equal(m.slot,3);e.poll();assert.equal(e.currentId,63);// NEXT skips the parts
e.stop();m.playing=0;e.pendingId=0;e.editmode(1);
// Moves carry the whole block (song + parts) on every track, with scene settings; the gap stays between songs.
e.choose(0);e.movedown();assert.deepEqual(names(),['B','A','+A2','+ A3','Gap','+orphan','C']);
assert.equal(row(2),'b,a,a2,a3,,,c');assert.equal(row(5),'B,A,A2,,x,,C');assert.deepEqual(m.scenes.map(s=>s.tempo),[100,120,150,140,-1,-1,90]);
assert.equal(m.scenes.length,7);assert.equal(e.scenes[e.at(e.currentId)].name,'A');assert.equal(e.scenes[1].parts.length,2);
e.moveup();assert.deepEqual(names(),['A','+A2','+ A3','B','Gap','+orphan','C']);assert.equal(row(5),'A,A2,,B,x,,C');assert.equal(e.at(e.currentId),0);
e.choose(1);e.movedown();assert.deepEqual(names(),['A','+A2','+ A3','C','Gap','+orphan','B']);assert.equal(row(2),'a,a2,a3,c,,,b');
// DELETE removes the song with its parts.
e.choose(0);e.remove();e.remove();assert.deepEqual(names(),['C','Gap','+orphan','B']);assert.equal(row(5),'C,x,,B');assert.deepEqual(e.scenes.map(s=>s.name),['C','B']);
// ADD SONG with a '+' name adds a part at the end of the current song; UPDATE CURRENT refuses it.
model.playing=0;c.scan();c.currentId=c.scenes[0].id;const songs=c.scenes.length,after=c.scenes[0].index+1;
c.text('+Bridge');c.bpm(160);c.add();assert.equal(model.scenes[after].name,'+Bridge');assert.equal(model.scenes[after].bpm,160);assert.equal(model.scenes[after].has,1);
assert.equal(c.scenes.length,songs);assert.deepEqual(c.scenes[0].parts.map(q=>q.name),['Bridge']);assert(ui.status.includes('part'));
c.text('+Outro');c.bpm(90);c.add();assert.deepEqual(c.scenes[0].parts.map(q=>q.name),['Bridge','Outro']);assert.equal(model.scenes[after+1].name,'+Outro');
c.text('+X');c.update();assert(ui.status.includes('edit its parts in Live'));
const p=JSON.parse(fs.readFileSync(__dirname+'/Debarulers-Stage-Manager.maxpat'));
function validate(p){const ids=new Set(p.boxes.map(b=>b.box.id));for(const l of p.lines){assert(ids.has(l.patchline.source[0]));assert(ids.has(l.patchline.destination[0]));}for(const b of p.boxes)if(b.box.patcher)validate(b.box.patcher);}
validate(p.patcher);
// The instrument synthesises the click itself and depends on no file but the embedded script.
assert(p.patcher.boxes.some(b=>b.box.text==='plugout~'));
// Global accent switch: C1 goes through the gate, which the device-face toggle points at the accent or the plain beat.
const wire=(x,y)=>p.patcher.lines.some(l=>l.patchline.source.join()===x&&l.patchline.destination.join()===y);
assert(wire('sel36,0','ggate,1')&&wire('ggate,0','trigA,0')&&wire('ggate,1','trigB,0')&&wire('gaccent,0','gsel,0')&&wire('gsel,0','ggate,0'));assert(!wire('sel36,0','trigA,0'));assert(!JSON.stringify(p).match(/buffer~|sfplay~|play~/));
const pan=p.patcher.boxes.find(b=>b.box.patcher).box.patcher,pwire=(x,y)=>pan.lines.some(l=>l.patchline.source[0]===x&&l.patchline.destination[0]===y),cmd=id=>pan.boxes.find(b=>b.box.id===id).box.text;
assert(pwire('editmode','editpre')&&pwire('editpre','js')&&cmd('editpre')==='prepend editmode');
for(const [b,c,t] of [['moveup','moveupcmd','moveup'],['movedown','movedowncmd','movedown'],['delete','deletecmd','remove']]) assert(pwire(b,c)&&pwire(c,'js')&&cmd(c)===t);
const {pack,unpack,NAME}=require('./build_amxd.cjs'),js=fs.readFileSync(__dirname+'/stage_click.js'),amxd=pack(p,{'stage_click.js':js}),back=unpack(amxd);
assert.equal(amxd.toString('latin1',8,12),'iiii');assert.deepEqual(Object.keys(back),[NAME,'stage_click.js']);assert(back['stage_click.js'].equals(js));
const dev=JSON.parse(back[NAME].toString('utf8').replace(/\0$/,''));assert.equal(dev.patcher.project.amxdtype,0x69696969);assert.deepEqual(dev.patcher.boxes,p.patcher.boxes);
console.log('PASS: start, stop, next/previous, empty scenes hidden, boundaries, external launch, cancellation, reorder, setlist add/update, per-song accent, edit mode move/delete, song parts, click synth wiring, patch wiring, frozen amxd packing. Live/Max runtime still untested.');