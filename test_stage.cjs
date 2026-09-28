const fs=require('fs'),vm=require('vm'),assert=require('assert');
let model={scenes:[{id:10,name:'Stream',bpm:120,has:1},{id:11,name:'Fantasy',bpm:135,has:1},{id:12,name:'Empty',bpm:105,has:0}],playing:0,slot:-1,selected:10,tempo:120,calls:[]};
class API {
 constructor(cb,path){this.path=path;this.id=path==='live_set'?1:path==='this_device canonical_parent'?2:3;this.type=path==='this_device canonical_parent'?'Track':'Song';}
 get(prop){let s=model.scenes.find(s=>s.id===this.id);
 if(prop==='name')return [s?s.name:'CLIC'];
 if(prop==='tempo')return [s?s.bpm:model.tempo];
 if(prop==='scenes')return model.scenes.flatMap(s=>['id',s.id]);
 if(prop==='clip_slots')return model.scenes.flatMap((s,i)=>['id',100+i]);
 if(prop==='has_clip')return [model.scenes[this.id-100].has];
 if(prop==='selected_scene')return ['id',model.selected];
 if(prop==='is_playing')return [model.playing];
 if(prop==='playing_slot_index')return [model.slot];throw new Error(prop);}
 call(fn,arg){model.calls.push([fn,arg]);if(fn==='fire'){model.slot=model.scenes.findIndex(s=>s.id===this.id);model.playing=1;model.tempo=model.scenes[model.slot].bpm;}if(fn==='stop_playing')model.playing=0;if(fn==='stop_all_clips')model.slot=-1;}
}
const ui={};const c={LiveAPI:API,Task:function(){this.cancel=()=>{};this.repeat=()=>{};},Date,Math,Number,String,Error,patcher:{getnamed:n=>({message:(k,v)=>ui[n]=v})}};
vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/stage_click.js','utf8'),c);
c.init();assert.equal(c.currentId,10);
c.start();c.poll();assert.equal(model.tempo,120);assert.equal(c.pendingId,0);
c.stop();assert.equal(model.playing,0);
c.lastPress=0;c.next();c.poll();assert.equal(c.currentId,11);assert.equal(model.tempo,135);
c.lastPress=0;c.next();assert.equal(c.currentId,11);assert(ui.status.includes('Aucun clip'));
c.lastPress=0;c.previous();c.poll();assert.equal(c.currentId,10);
c.lastPress=0;c.previous();assert.equal(c.currentId,10);assert(ui.status.includes('Premier'));
// Actual playback, not selected scene, drives the current title.
model.slot=1;model.playing=1;model.selected=10;c.poll();assert.equal(c.currentId,11);
c.pendingId=10;c.stop();assert.equal(c.pendingId,0);assert.equal(model.playing,0);
model.scenes[2].has=1;c.scan();c.lastPress=0;c.next();c.poll();assert.equal(c.currentId,12);
c.lastPress=0;let count=model.calls.length;c.next();assert.equal(model.calls.length,count);assert(ui.status.includes('Fin'));
// Stable scene IDs survive reordering.
model.playing=0;model.scenes.reverse();c.scan();assert.equal(c.currentId,12);assert.equal(c.at(12),0);
const p=JSON.parse(fs.readFileSync(__dirname+'/Stage-Click.maxpat'));
function validate(p){const ids=new Set(p.boxes.map(b=>b.box.id));for(const l of p.lines){assert(ids.has(l.patchline.source[0]));assert(ids.has(l.patchline.destination[0]));}for(const b of p.boxes)if(b.box.patcher)validate(b.box.patcher);}
validate(p.patcher);console.log('PASS: start, stop, next/previous, empty clip, boundaries, external launch, cancellation, reorder, patch wiring. Live/Max runtime still untested.');