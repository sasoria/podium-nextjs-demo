import utils from "@podium/utils";
import parse from "html-react-parser";

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

export const parseCssAssetsToReactHtml = (podlets) =>
  podlets.map((podlet) => {
    if (!isEmpty(podlet.css)) {
      return parse(utils.buildLinkElement(podlet.css[0]));
    }
  });

export const parseJsAssetsToReactHtml = (podlets) =>
  podlets.map((podlet) => {
    if (!isEmpty(podlet.js)) {
      return parse(utils.buildScriptElement(podlet.js[0]));
    }
  });
