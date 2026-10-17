(function(){
  var nav=document.querySelector('nav'),root=document.documentElement;
  function navh(){root.style.setProperty('--navh',nav.offsetHeight+'px')}
  navh();
  var pad=document.querySelector('.pad'); if(!pad) return;
  var svg=pad.querySelector('svg'),panel=document.querySelector('.panel');
  var roN=pad.querySelector('.ro-name'),roA=pad.querySelector('.ro-act');
  var MAP={lt:'lt',rt:'rt',lb:'lb',rb:'rb',ls:'ls',l3:'ls',rs:'rs',r3:'rs','d-pad':'dpad',dpad:'dpad',a:'a',b:'b',x:'x',y:'y',view:'view',menu:'menu',xbox:'xbox',share:'share'};
  function ids(t){t=t.toLowerCase().replace(/left stick/g,'ls').replace(/right stick/g,'rs');var o=[];
    t.split(/[^a-z0-9-]+/).forEach(function(w){var m=MAP[w];if(m&&o.indexOf(m)<0)o.push(m)});return o}
  var rows=[].slice.call(document.querySelectorAll('.row[data-c]'));
  document.querySelectorAll('tr, .start>div').forEach(function(r){
    var k=r.querySelector('.k'); if(!k) return; var c=ids(k.textContent);
    if(c.length){r.setAttribute('data-c',c.join(' '));r.tabIndex=0;r.setAttribute('role','button');rows.push(r)}
  });
  function info(r){
    var n=r.querySelector('.k').textContent, a='';
    var act=r.querySelector('.act'); if(act) a=act.textContent;
    else if(r.tagName==='TR') a=r.lastElementChild.textContent;
    else {var b=r.querySelector('b'),p=r.querySelector('p');a=(b?b.textContent:'')+(p?' — '+p.textContent:'')}
    return [n,a.replace(/\[uncertain\]/,'(uncertain)')];
  }
  function light(list){
    svg.querySelectorAll('.ctl.on').forEach(function(g){g.classList.remove('on')});
    void svg.getBoundingClientRect();
    list.forEach(function(id){var g=document.getElementById('c-'+id);if(g)g.classList.add('on')});
  }
  function stacked(){return !matchMedia('(min-width:901px) and (orientation:landscape)').matches}
  function scrollTo(r,inst){var bh=inst?'auto':'smooth';
    var p=r.closest('.panel');
    if(p&&!stacked()&&p.scrollHeight>p.clientHeight+2){
      p.scrollTo({top:r.offsetTop-p.clientHeight/2+r.offsetHeight/2,behavior:bh});
    }else{
      var off=stacked()?pad.getBoundingClientRect().bottom+12:nav.offsetHeight+24;
      var y=r.getBoundingClientRect().top+window.scrollY-off;
      window.scrollTo({top:Math.max(0,y),behavior:bh});
    }
  }
  function select(r,scroll){
    rows.forEach(function(x){x.classList.remove('sel');x.removeAttribute('aria-pressed')});
    r.classList.add('sel');r.setAttribute('aria-pressed','true');
    light(r.getAttribute('data-c').split(' '));
    var i=info(r);roN.textContent=i[0];roA.textContent=i[1];
    if(scroll) scrollTo(r,scroll==='now');
  }
  rows.forEach(function(r){
    r.addEventListener('click',function(e){if(e.target.closest('a'))return;select(r,false)});
    r.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();select(r,false)}});
  });
  svg.querySelectorAll('.ctl').forEach(function(g){
    g.addEventListener('click',function(){
      var id=g.id.slice(2);
      var r=rows.filter(function(x){return x.getAttribute('data-c').split(' ').indexOf(id)>=0})[0];
      if(r) select(r,true);
      else{rows.forEach(function(x){x.classList.remove('sel')});light([id]);roN.textContent=g.getAttribute('aria-label');roA.textContent='Not used on this page.'}
    });
  });
  function sync(){navh();if(panel)panel.style.height=stacked()?'':pad.offsetHeight+'px'}
  sync(); window.addEventListener('resize',sync);
  if(window.ResizeObserver) new ResizeObserver(sync).observe(pad);
  var q=location.hash.match(/^#sel=(\w+)/);
  if(q){var r=rows.filter(function(x){return x.getAttribute('data-c').split(' ').indexOf(q[1])>=0})[0];if(r)setTimeout(function(){sync();select(r,'now')},50)}
})();
