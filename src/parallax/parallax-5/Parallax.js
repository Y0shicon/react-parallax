import { useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/all";
import "./styles.css";

import image1 from "./1.jpg";
import image2 from "./2.jpg";
import image3 from "./3.jpg";

const gsapInit = () => {
  gsap.registerPlugin(Observer);

  let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

  // console.log(outerWrappers);
  // gsap.set(outerWrappers, { xPercent: 100 });
  // gsap.set(innerWrappers, { xPercent: -100 });

  function transition1(dFactor) {
    if (dFactor === 1) {
    gsap.set(sections[0], { zIndex: 0 });
    gsap.set(sections[1], { zIndex: 1, autoAlpha: 1 });
    } else {
    gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 });
    gsap.set(sections[1], { zIndex: 0 });
    }

    gsap.set(outerWrappers[1], { yPercent: 100 * dFactor });

    // Play the timeline in reverse if dfactor is negative
    let tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut", reversed: dFactor < 0 },
      onComplete: () => (animating = false),
    });
    tl.fromTo(
      [outerWrappers[1], innerWrappers[1]],
      { yPercent: 100 },
      { yPercent: 0 },
      0
    ).fromTo(
      [outerWrappers[0], innerWrappers[0]],
      { yPercent: 0 },
      { yPercent: -100 },
      0
    ).set(sections[dFactor > 0 ? 0 : 1], { autoAlpha: 0 });
  }

  function transition2(dFactor) {
    if (dFactor === 1) {
    gsap.set(sections[1], { zIndex: 0 });
    gsap.set(sections[2], { zIndex: 1, autoAlpha: 1 });
    } else {
    gsap.set(sections[1], { zIndex: 1, autoAlpha: 1 });
    gsap.set(sections[2], { zIndex: 0 });
    }

    gsap.set(outerWrappers[2], { xPercent: 100 * dFactor });

    // Play the timeline in reverse if dfactor is negative
    let tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut", reversed: dFactor < 0 },
      onComplete: () => (animating = false),
    });

    tl.fromTo(
      [outerWrappers[1], innerWrappers[1]],
      { xPercent: 0 },
      { xPercent: -100 },
      0
    ).fromTo(
      [outerWrappers[2], innerWrappers[2]],
      { xPercent: 100 },
      { xPercent: 0 },
      0
    ).set(sections[dFactor > 0 ? 1 : 2], { autoAlpha: 0 });
  }

  function initialTransition(dFactor) {
    gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 });
    let tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => (animating = false),
    });
    tl.fromTo(
      [outerWrappers[0], innerWrappers[0]],
      { xPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
      { xPercent: 0 },
      0
    );
  }

  const gotoSection = (index, direction) => {
    if (index < 0) return;
    animating = true;
    let fromTop = direction === -1,
    dFactor = fromTop ? -1 : 1;
    
    console.log({ currentIndex, index, dFactor });

    if ((currentIndex === 0 && index === 1) || (currentIndex === 1 && index === 0)) {
      transition1(dFactor);
    }else if ((currentIndex === 1 && index === 2) || (currentIndex === 2 && index === 1)) {
      transition2(dFactor);
    } 
    else if (currentIndex === -1){
      // Initially the first section is visible
      initialTransition(dFactor);
    }
    currentIndex = index;
  };

  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true,
  });

  gotoSection(0, 1);
};

const sections = [
  { title: "Infinite", image: image1 },
  { title: "Scrolling", image: image2 },
  { title: "Website", image: image3 },
];

export const Parallax = () => {
  useEffect(() => {
    gsapInit();
  }, []);

  return sections.map((section) => (
    <section key={section.title}>
      <div className="outer">
        <div className="inner">
          <div
            className="bg one"
            style={{ backgroundImage: `url(${section.image})` }}
          >
            <h2>{section.title}</h2>
          </div>
        </div>
      </div>
    </section>
  ));
};
