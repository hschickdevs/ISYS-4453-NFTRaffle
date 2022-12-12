import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, {useEffect} from 'react'
import { init } from './Web3Client'


export default function Home() {
  useEffect(() => {
    init()

  }, []);
  
  const join = () => {
    window.location="/join"
  }

  const create = () => {
    window.location="/create"
  }
  return (
<>
  <h1 data-text="raffle.eth">
    <span>raffle.eth</span>
  </h1>
  <main>
    <button onClick={join}>
      Join Raffle
    </button>

    <button onClick={create}>Create Raffle</button>
  </main>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "html {\n\theight: 100%;\n\tdisplay: flex;\n}\nbody {\n\tposition: relative;\n\tmargin: auto;\n\tbackground: #181620;\n\tperspective: 500px;\n}\n\nmain {\n\tdisplay: flex;\n\tflex-direction: column;\n\ttransform: rotatex(10deg);\n\tanimation: rotateAngle 6s linear infinite;\n}\n\nbutton {\n\tdisplay: block;\n\tposition: relative;\n\tmargin: 0.5em 0;\n\tpadding: .8em 2.2em;\n\tcursor: pointer;\n\n\tbackground: #FFFFFF;\n\tborder: none;\n\tborder-radius: .4em;\n\n\ttext-transform: uppercase;\n\tfont-size: 1.4em;\n\tfont-family: \"Work Sans\", sans-serif;\n\tfont-weight: 500;\n\tletter-spacing: 0.04em;\n\n\tmix-blend-mode: color-dodge;\n\tperspective: 500px;\n\ttransform-style: preserve-3d;\n\n\t&:before, &:after {\n\t\t--z: 0px;\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tdisplay: block;\n\t\tcontent: '';\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\topacity: 0;\n\t\tmix-blend-mode: inherit;\n\t\tborder-radius: inherit;\n\t\ttransform-style: preserve-3d;\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 0px), \n\t\t\tcalc(var(--z) * 0px), \n\t\t\tcalc(var(--z) * 0px)\n\t\t);\n\t}\n\t\n\tspan {\n\t\tmix-blend-mode: none;\n\t\tdisplay: block;\n\t}\n\t\n\t&:after {\n\t\tbackground-color: #5D00FF;\n\t}\n\t\n\t&:before {\n\t\tbackground-color: #FF1731;\n\t}\n\t\n\t&:hover {\n\t\tbackground-color: #FFF65B;\n\t\ttransition: background .3s 0.1s;\n\t}\n\t\n\t&:hover:before {\n\t\t--z: 0.04;\n\t\tanimation: translateWobble 2.2s ease forwards;\n\t}\n\t\n\t&:hover:after {\n\t\t--z: -0.06;\n\t\tanimation: translateWobble 2.2s ease forwards;\n\t}\n}\n\n@keyframes rotateAngle {\n\t0% {\n\t\ttransform: rotateY(0deg) rotateX(10deg);\n\t\tanimation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);\n\t}\n\t25% {\n\t\ttransform: rotateY(20deg) rotateX(10deg);\n\t}\n\t50% {\n\t\ttransform: rotateY(0deg) rotateX(10deg);\n\t\tanimation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);\n\t}\n\t75% {\n\t\ttransform: rotateY(-20deg) rotateX(10deg);\n\t}\n\t100% {\n\t\ttransform: rotateY(0deg) rotateX(10deg);\n\t}\n}\n\n@keyframes translateWobble {\n  0% {\n\t\topacity: 0;\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 0px), \n\t\t\tcalc(var(--z) * 0px), \n\t\t\tcalc(var(--z) * 0px)\n\t\t);\n  }\n  16% {\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 160px), \n\t\t\tcalc(var(--z) * 160px), \n\t\t\tcalc(var(--z) * 160px)\n\t\t);\n  }\n  28% {\n\t\topacity: 1;\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 70px), \n\t\t\tcalc(var(--z) * 70px), \n\t\t\tcalc(var(--z) * 70px)\n\t\t);\n  }\n  44% {\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 130px), \n\t\t\tcalc(var(--z) * 130px), \n\t\t\tcalc(var(--z) * 130px)\n\t\t);\n  }\n  59% {\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 85px), \n\t\t\tcalc(var(--z) * 85px), \n\t\t\tcalc(var(--z) * 85px)\n\t\t);\n  }\n  73% {\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 110px), \n\t\t\tcalc(var(--z) * 110px), \n\t\t\tcalc(var(--z) * 110px)\n\t\t);\n  }\n\t88% {\n\t\topacity: 1;\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 90px), \n\t\t\tcalc(var(--z) * 90px), \n\t\t\tcalc(var(--z) * 90px)\n\t\t);\n  }\n  100% {\n\t\topacity: 1;\n\t\ttransform: translate3d(\n\t\t\tcalc(var(--z) * 100px), \n\t\t\tcalc(var(--z) * 100px), \n\t\t\tcalc(var(--z) * 100px)\n\t\t);\n  }\n}\n    body {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n    background-color: #000;\n    overflow: hidden;\n}\n\nh1 {\n    position: fixed;\n    display: flex;\n    top: 0;\n    margin: 9.75rem;\n\n    font-family: 'Montserrat', Arial, sans-serif;\n    font-size: calc(20px + 5vw);\n    font-weight: 700;\n    color: #fff;\n    letter-spacing: 0.02em;\n    text-transform: uppercase;\n    text-shadow: 0 0 0.15em #1da9cc;\n    user-select: none;\n    white-space: nowrap;\n    filter: blur(0.007em);\n    animation: shake 2.5s linear forwards;\n}\n\nh1 span {\n    position: absolute;\n    top: 0;\n    left: 0;\n    transform: translate(-50%, -50%);\n    -webkit-clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%);\n            clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%);\n}\n\nh1::before,\nh1::after {\n    content: attr(data-text);\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n\nh1::before {\n    animation: crack1 2.5s linear forwards;\n    -webkit-clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%);\n            clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%);\n}\n\nh1::after {\n    animation: crack2 2.5s linear forwards;\n    -webkit-clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%);\n            clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%);\n}\n\n@keyframes shake {\n    5%, 15%, 25%, 35%, 55%, 65%, 75%, 95% {\n        filter: blur(0.018em);\n        transform: translateY(0.018em) rotate(0deg);\n    }\n\n    10%, 30%, 40%, 50%, 70%, 80%, 90% {\n        filter: blur(0.01em);\n        transform: translateY(-0.018em) rotate(0deg);\n    }\n\n    20%, 60% {\n        filter: blur(0.03em);\n        transform: translate(-0.018em, 0.018em) rotate(0deg);\n    }\n\n    45%, 85% {\n        filter: blur(0.03em);\n        transform: translate(0.018em, -0.018em) rotate(0deg);\n    }\n\n    100% {\n        filter: blur(0.007em);\n        transform: translate(0) rotate(-0.5deg);\n    }\n}\n\n@keyframes crack1 {\n    0%, 95% {\n        transform: translate(-50%, -50%);\n    }\n\n    100% {\n        transform: translate(-51%, -48%);\n    }\n}\n\n@keyframes crack2 {\n    0%, 95% {\n        transform: translate(-50%, -50%);\n    }\n\n    100% {\n        transform: translate(-49%, -53%);\n    }\n}\n"
    }}
  />
</>
  )
}
