// Packs Debarulers-Stage-Manager.maxpat into a frozen instrument .amxd with stage_click.js embedded, no Max needed.
// Layout matches devices saved by Max (Ableton/maxdevtools maxdiff/tests/test_files/FrozenTest.amxd):
// 'ampf' u32le 4 'iiii' 'meta' u32le 4 u32le 7 'ptch' u32le len <ptch>
// <ptch> = 'mx@c' u32be 16 u64be footerOffset, then the device JSON (NUL-terminated) and each file back to back,
// then footer 'dlst' u32be size, one 'dire' per file: type fnam sz32 of32 vers flag mdat (sizes include 8-byte headers).
const fs=require('fs'),path=require('path'),assert=require('assert');
const HEADER=32, IIII=0x69696969, MAX_EPOCH=2082844800, NAME='Debarulers-Stage-Manager.amxd';
const field=(k,v)=>{const h=Buffer.alloc(8);h.write(k,0,'latin1');h.writeUInt32BE(8+v.length,4);return Buffer.concat([h,v]);};
const u32=n=>{const b=Buffer.alloc(4);b.writeUInt32BE(n);return b;};
function pack(patch,files) {
 const p=JSON.parse(JSON.stringify(patch)), now=Math.floor(Date.now()/1000)+MAX_EPOCH;
 // Max refuses a device without its project block ("a project without a name ... fatal").
 p.patcher.project=p.patcher.project||{version:1,creationdate:now,modificationdate:now,viewrect:[0,0,300,500],autoorganize:1,hideprojectwindow:1,showdependencies:1,autolocalize:0,contents:{patchers:{}},layout:{},searchpath:{},detailsvisible:0,amxdtype:IIII,readonly:0,devpathtype:0,devpath:'.',sortmode:0,viewmode:0,includepackages:0};
 const entries=[{type:'JSON',name:NAME,flag:0x11,data:Buffer.from(JSON.stringify(p,null,4)+'\0','utf8')}]
  .concat(Object.keys(files).map(name=>({type:'TEXT',name,flag:0,data:files[name]})));
 let offset=16;
 const dirs=entries.map(e=>{
  const fnam=Buffer.alloc((Math.floor(e.name.length/4)+1)*4);fnam.write(e.name,'latin1');
  const d=field('dire',Buffer.concat([field('type',Buffer.from(e.type,'latin1')),field('fnam',fnam),field('sz32',u32(e.data.length)),
   field('of32',u32(offset)),field('vers',u32(0)),field('flag',u32(e.flag)),field('mdat',u32(now))]));
  offset+=e.data.length;return d;});
 const head=Buffer.alloc(16);head.write('mx@c',0,'latin1');head.writeUInt32BE(16,4);head.writeBigUInt64BE(BigInt(offset),8);
 const ptch=Buffer.concat([head,...entries.map(e=>e.data),field('dlst',Buffer.concat(dirs))]), h=Buffer.alloc(HEADER);
 h.write('ampfxxxxiiiimetaxxxxxxxxptch',0,'latin1');
 h.writeUInt32LE(4,4);h.writeUInt32LE(4,16);h.writeUInt32LE(7,20);h.writeUInt32LE(ptch.length,28);
 return Buffer.concat([h,ptch]);
}
// Returns {fileName: Buffer} for every frozen entry, the device JSON included.
function unpack(b) {
 assert.equal(b.toString('latin1',0,4),'ampf');assert.equal(b.toString('latin1',24,28),'ptch');
 const p=b.subarray(HEADER);assert.equal(b.readUInt32LE(28),p.length);assert.equal(p.toString('latin1',0,4),'mx@c');
 const foot=p.subarray(Number(p.readBigUInt64BE(8)));assert.equal(foot.toString('latin1',0,4),'dlst');assert.equal(foot.readUInt32BE(4),foot.length);
 const out={};
 for(let q=8;q<foot.length;q+=foot.readUInt32BE(q+4)) {
  const f={};
  for(let r=q+8;r<q+foot.readUInt32BE(q+4);r+=foot.readUInt32BE(r+4)) f[foot.toString('latin1',r,r+4)]=foot.subarray(r+8,r+foot.readUInt32BE(r+4));
  out[f.fnam.toString('latin1').replace(/\0+$/,'')]=p.subarray(f.of32.readUInt32BE(),f.of32.readUInt32BE()+f.sz32.readUInt32BE());
 }
 return out;
}
if(require.main===module) {
 const dist=path.join(__dirname,'dist'),read=f=>fs.readFileSync(path.join(__dirname,f));
 fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist);
 fs.writeFileSync(path.join(dist,NAME),pack(JSON.parse(read('Debarulers-Stage-Manager.maxpat')),{'stage_click.js':read('stage_click.js')}));
 fs.copyFileSync(path.join(__dirname,'README.md'),path.join(dist,'README.md'));
 console.log('Built dist/'+NAME+' (frozen, stage_click.js embedded)');
}
module.exports={pack,unpack,NAME};
