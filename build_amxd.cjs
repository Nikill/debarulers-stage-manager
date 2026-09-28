// Packs Debarulers-Stage-Manager.maxpat into an unfrozen MIDI-effect .amxd, no Max needed.
// Layout matches devices saved by Max (see Ableton/maxdevtools test files):
// 'ampf' u32le 4 'mmmm' 'meta' u32le 4 u32le 0 'ptch' u32le len <patcher JSON> NUL
const fs=require('fs'),path=require('path'),assert=require('assert');
const HEADER=32, MMMM=0x6d6d6d6d, MAX_EPOCH=2082844800;
function pack(patch) {
 const p=JSON.parse(JSON.stringify(patch)), now=Math.floor(Date.now()/1000)+MAX_EPOCH;
 // Max refuses a device without its project block ("a project without a name ... fatal").
 p.patcher.project=p.patcher.project||{version:1,creationdate:now,modificationdate:now,viewrect:[0,0,300,500],autoorganize:1,hideprojectwindow:1,showdependencies:1,autolocalize:0,contents:{patchers:{}},layout:{},searchpath:{},detailsvisible:0,amxdtype:MMMM,readonly:0,devpathtype:0,devpath:'.',sortmode:0,viewmode:0,includepackages:0};
 const json=Buffer.from(JSON.stringify(p,null,4)+'\0','utf8'), h=Buffer.alloc(HEADER);
 h.write('ampfxxxxmmmmmetaxxxxxxxxptch',0,'latin1');
 h.writeUInt32LE(4,4);h.writeUInt32LE(4,16);h.writeUInt32LE(0,20);h.writeUInt32LE(json.length,28);
 return Buffer.concat([h,json]);
}
function unpack(b) {
 assert.equal(b.toString('latin1',0,4),'ampf');assert.equal(b.toString('latin1',24,28),'ptch');
 assert.equal(b.readUInt32LE(28),b.length-HEADER);assert.equal(b[b.length-1],0);
 return JSON.parse(b.toString('utf8',HEADER,b.length-1));
}
if(require.main===module) {
 const dist=path.join(__dirname,'dist');fs.mkdirSync(dist,{recursive:true});
 fs.writeFileSync(path.join(dist,'Debarulers-Stage-Manager.amxd'),pack(JSON.parse(fs.readFileSync(path.join(__dirname,'Debarulers-Stage-Manager.maxpat'),'utf8'))));
 for(const f of ['stage_click.js','README.md']) fs.copyFileSync(path.join(__dirname,f),path.join(dist,f));
 console.log('Built dist/Debarulers-Stage-Manager.amxd');
}
module.exports={pack,unpack};
