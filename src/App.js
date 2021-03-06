import React, { useState, useEffect, useCallback } from "react";
import Inputs from "./Inputs";
import { CopyOutlined } from "@ant-design/icons";
import Recentcolor from "./Recentcolor";
import { message } from "antd";
import Colorcode from "./Colorcode";
import Palette from "./palette/Palette";
import { randomColorValue, getrecent, convert } from "./functions";

function App() {
  const colors = ["red", "green", "blue"];
  const [color, setColor] = useState({
    red: 222,
    green: 215,
    blue: 34,
  });
  const { red, green, blue } = color;
  const [rgbCode, setrgbCode] = useState(`rgb(${red},${green},${blue})`);
  const [hexCode, setHexcode] = useState("");
  // destructing color object
  const [history, setHistory] = useState(getrecent());
  // if there'll be recent colors in localstorage then show recent section will be visible 
  const [showRecent, setshowrecent] = useState(() => {
    if (history.length === 0) {
      return false;
    }
    return true;
  });
  // const [recentColor, setRecentColor] = useState(history.slice(0, 8));
  const [isRGB, setisRGB] = useState(true);
  const [color4copy, setColor4copy] = useState("");
  // converting color
  const rgb2hex = useCallback(() => {
    return "#" + convert(red) + convert(green) + convert(blue);
  }, [red, green, blue]);
  useEffect(() => {
    setHexcode(rgb2hex());
    setrgbCode(`rgb(${red},${green},${blue})`);
    if (isRGB) {
      setColor4copy(rgbCode);
    } else {
      setColor4copy(hexCode);
    }
  }, [rgb2hex, red, green, blue, isRGB, rgbCode, hexCode]);
  function ChangeColor(c, e) {
    setColor((previousState) => {
      return { ...previousState, [c]: e };
    });
  }
  // change color from recently generated
  const updatefromHstory = (rgb) => {
    rgb = rgb
      .substring(4, rgb.length - 1)
      .replace(/ /g, "")
      .split(",");
    let [r, g, b] = rgb;
    setColor({ red: r, green: g, blue: b });
  };
  const clearRecent = () => {
    localStorage.removeItem("color");
    setHistory([]);
    // setRecentColor([]);
    setshowrecent(false);
  };

  // generating random color and adding in recent colors 
  const randomColor = () => {
    setshowrecent(true);
    let r = randomColorValue();
    let g = randomColorValue();
    let b = randomColorValue();
    setColor({ red: r, green: g, blue: b });
    let color = `rgb(${r},${g},${b})`;
    history.unshift(color);
    if (history.length > 10) {
      history.pop();
    }
    // setRecentColor(history.slice(0, 8));
    localStorage.setItem("color", JSON.stringify(history.slice(0, 8)));
    // let recent = localStorage.getItem("color");
  };
  return (
    <>
      <main style={{ background: `rgb(${red},${green},${blue})` }}>
        <section className="container max-width-500 py-5">
          <div className="wrapper ">
            <div className="title">
              <h1 className="mb-2  ">Color Picker</h1>
            </div>
            <div className="picker-body">
              <div className="d-flex align-items-center my-3">
                <CopyOutlined
                  onClick={() => {
                    navigator.clipboard.writeText(color4copy);
                    message.open({ content: `color ${color4copy} copied` }, 2);
                  }}
                  className="me-2 fs-5 copyIcon position-relative"
                />
                <h3 className="colorCode py-2 ps-0 px-3 m-0 user-select-none position-relative">
                  <Colorcode
                    rgbCode={rgbCode}
                    isrgb={isRGB}
                    hexCode={hexCode}
                  />
                </h3>
              </div>
              <button
                className="convertColorcodeBtn customBtn"
                onClick={() => {
                  setisRGB(!isRGB);
                  message.open(
                    {
                      content:
                        `color type changed to ` + (isRGB ? `rgb` : `hex`),
                    },
                    2
                  );
                }}
              >
                convert to {isRGB ? "hex" : "rgb"}
              </button>
              {colors.map((clr, index) => {
                return (
                  <Inputs
                    key={index}
                    color={clr}
                    ChangeColor={ChangeColor}
                    Value={color}
                  />
                );
              })}
              <button
                className="randomBtn mt-3 customBtn"
                onClick={() => {
                  randomColor();
                }}
              >
                generate random
              </button>
            </div>
            <div className="paletteDiv py-3">
              <Palette rgbCode={rgbCode} isrgb={isRGB} />
            </div>
            <div
              className={`recentlyGenerated py-3 ${!showRecent && "d-none"}`}
            >
              <Recentcolor
                recent={history.slice(0, 8)}
                updatefromHstory={updatefromHstory}
                clearRecent={clearRecent}
                color4copy={color4copy}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
