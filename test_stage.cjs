const fs=require('fs'),vm=require('vm'),assert=require('assert');
let model={scenes:[{id:10,name:'Stream',bpm:120,has:1},{id:11,name:'Fantasy',bpm:135,has:1},{id:12,name:'Empty',bpm:105,has:0}],playing:0,slot:-1,selected:10,tempo:120,calls:[],clips:{}};
class API {
 constructor(cb,path){this.path=path;this.id=path==='live_set'?1:path==='this_device canonical_parent'?2:3;this.type=path==='this_device canonical_parent'?'Track':'Song';}
 get(prop){let s=model.scenes.find(s=>s.id===this.id);
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
 if(fn==='create_clip'){model.scenes[this.id-100].has=1;model.clips[this.id-100]={length:arg};}if(fn==='add_new_notes')model.clips[this.id-1000].notes=arg.notes;if(fn==='fire'){model.slot=model.scenes.findIndex(s=>s.id===this.id);model.playing=1;model.tempo=model.scenes[model.slot].bpm;}if(fn==='stop_playing')model.playing=0;if(fn==='stop_all_clips')model.slot=-1;}
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
assert.equal(clip.length,4);assert.equal(clip.looping,1);assert.deepEqual(clip.notes.map(n=>[n.pitch,n.start_time]),[[36,0],[37,1],[37,2],[37,3]]);
c.text('Renamed');c.bpm(99);c.update();assert.equal(model.scenes[0].name,'Renamed');assert.equal(model.scenes[0].bpm,99);assert.equal(c.currentId,12);
const p=JSON.parse(fs.readFileSync(__dirname+'/Debarulers-Stage-Manager.maxpat'));
function validate(p){const ids=new Set(p.boxes.map(b=>b.box.id));for(const l of p.lines){assert(ids.has(l.patchline.source[0]));assert(ids.has(l.patchline.destination[0]));}for(const b of p.boxes)if(b.box.patcher)validate(b.box.patcher);}
validate(p.patcher);
// The instrument synthesises the click itself and depends on no file but the embedded script.
assert(p.patcher.boxes.some(b=>b.box.text==='plugout~'));assert(!JSON.stringify(p).match(/buffer~|sfplay~|play~/));
const {pack,unpack,NAME}=require('./build_amxd.cjs'),js=fs.readFileSync(__dirname+'/stage_click.js'),amxd=pack(p,{'stage_click.js':js}),back=unpack(amxd);
assert.equal(amxd.toString('latin1',8,12),'iiii');assert.deepEqual(Object.keys(back),[NAME,'stage_click.js']);assert(back['stage_click.js'].equals(js));
const dev=JSON.parse(back[NAME].toString('utf8').replace(/\0$/,''));assert.equal(dev.patcher.project.amxdtype,0x69696969);assert.deepEqual(dev.patcher.boxes,p.patcher.boxes);
console.log('PASS: start, stop, next/previous, empty scenes hidden, boundaries, external launch, cancellation, reorder, setlist add/update, click synth wiring, patch wiring, frozen amxd packing. Live/Max runtime still untested.');