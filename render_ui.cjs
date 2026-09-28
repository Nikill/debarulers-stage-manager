// Draws docs/panel.svg from the patch's presentation layout, with the text filled in
// by running stage_click.js against a mock set. A preview, not a Max screenshot.
const fs=require('fs'),vm=require('vm'),path=require('path');
const setlist=[['Intro',92],['Stream',120],['Fantasy',135],['Nightdrive',104],['Hollow',88],['Paper Kites',126],['Low Tide',98],['Signal',140],['Encore',118],['Outro',90]];
const scenes=setlist.map(([name,bpm],i)=>({id:10+i,name,bpm}));
let slot=-1,playing=0;
class LiveAPI {
 constructor(cb,p){this.id=1;this.type=p==='this_device canonical_parent'?'Track':'Song';}
 get(k){const s=scenes.find(s=>s.id===this.id);
  return {scenes:scenes.flatMap(s=>['id',s.id]),clip_slots:scenes.flatMap((s,i)=>['id',100+i]),has_clip:[1],selected_scene:['id',10],
   name:[s?s.name:'Click'],tempo:[s?s.bpm:slot>=0?scenes[slot].bpm:120],is_playing:[playing],playing_slot_index:[slot]}[k];}
 call(fn){if(fn==='fire'){slot=scenes.findIndex(s=>s.id===this.id);playing=1;}}
}
const text={},c={LiveAPI,Task:function(){this.repeat=()=>{};this.cancel=()=>{};},Date,Math,Number,String,Error,
 patcher:{getnamed:n=>({message:(k,v)=>text[n]=v})}};
vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'stage_click.js'),'utf8'),c);
c.init();c.choose(1);c.poll();

const top=JSON.parse(fs.readFileSync(path.join(__dirname,'Debarulers-Stage-Manager.maxpat'),'utf8')).patcher;
const panel=top.boxes.find(b=>b.box.patcher).box.patcher,[,,W,H]=panel.rect;
const rgb=a=>`rgb(${a.slice(0,3).map(v=>Math.round(v*255))})`,esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const out=[`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Arial, Helvetica, sans-serif" xml:space="preserve" style="white-space:pre">`,
 `<rect width="${W}" height="${H}" fill="${rgb(panel.bgcolor)}"/>`];
for(const {box:b} of panel.boxes) {
 if(!b.presentation_rect) continue;
 const [x,y,w,h]=b.presentation_rect,t=esc(b.varname in text?text[b.varname]:b.text||''),f=b.fontsize||panel.default_fontsize,col=rgb(b.textcolor||[1,1,1,1]);
 if(b.maxclass==='textbutton') out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${b.rounded||0}" fill="${rgb(b.bgcolor)}"/>`,
  `<text x="${x+w/2}" y="${y+h/2}" font-size="${f}" fill="${col}" text-anchor="middle" dominant-baseline="central">${t}</text>`);
 else out.push(`<text x="${x+4}" y="${y+4+f*0.9}" font-size="${f}" fill="${col}">${t}</text>`);
}
fs.mkdirSync(path.join(__dirname,'docs'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'docs','panel.svg'),out.join('\n')+'\n</svg>\n');
console.log('Wrote docs/panel.svg');
