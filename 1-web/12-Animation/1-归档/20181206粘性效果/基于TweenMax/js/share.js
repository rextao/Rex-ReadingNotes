window.onload = function () {
  const $shareButtons = document.querySelectorAll(".share-button");
  const $toggleButton = document.querySelector(".share-toggle-button");
  let menuOpen=false;
  const buttonsNum=$shareButtons.length;
  const buttonsMid=(buttonsNum/2);
  const spacing=75; // 球中间空间大小

  function openShareMenu(){
    TweenMax.to($toggleButton,0.1,{
      scaleX:1.2,
      scaleY:0.6,
      ease:Quad.easeOut,
      onComplete:function(){
        TweenMax.to($toggleButton,.8,{
          scale:0.6,
          ease:Elastic.easeOut,
        });
        TweenMax.to($toggleButton.querySelectorAll(".share-icon"),.8,{
          scale:1.4,
          ease:Elastic.easeOut,
        });
      }
    });
    Array.from($shareButtons).forEach((item,i) =>{
      let pos=i-buttonsMid;
      if(pos>=0) pos+=1;
      let dist=Math.abs(pos);
      item.style.zIndex = buttonsMid - dist;
      TweenMax.to(item,1.1*(dist),{
        x:pos*spacing,
        scaleY:0.6,
        scaleX:1.1,
        ease:Elastic.easeOut,
      });
      TweenMax.to(item,.8,{
        delay:(0.2*(dist))-0.1,
        scale:0.6,
        ease:Elastic.easeOut,
      })
      TweenMax.fromTo(item.querySelectorAll(".share-icon"),0.2,{
        scale:0
      },{
        delay:(0.2*dist)-0.1,
        scale:1,
        ease:Quad.easeInOut
      })
		})
  }
  function closeShareMenu(){
    TweenMax.to([$toggleButton,$toggleButton.querySelectorAll(".share-icon")],1.4,{
      delay:0.1,
      scale:1,
      ease:Elastic.easeOut,
    });
    Array.from($shareButtons).forEach((item, i) => {
      let pos=i-buttonsMid;
      if(pos>=0) pos+=1;
      let dist=Math.abs(pos);
      item.style.zIndex =  dist;
      TweenMax.to(item,0.4+((buttonsMid-dist)*0.1),{
        x:0,
        scale:.95,
        ease:Quad.easeInOut,
      });
      TweenMax.to(item.querySelectorAll(".share-icon"),0.2,{
        scale:0,
        ease:Quad.easeIn
      });
    });
  }

  function toggleShareMenu(){
    menuOpen=!menuOpen;
    menuOpen?openShareMenu():closeShareMenu();
  }
  $toggleButton.addEventListener('mousedown',() => {
    toggleShareMenu();
  })
}