import { StaticImageData } from "next/image";

const context = require.context("./", true, /\.(png|jpe?g|svg)$/);
const images = context
  .keys()
  .filter((x) => x.startsWith("."))
  .reduce((acc: { [key: string]: StaticImageData }, key) => {
    const image = context(key).default;
    delete image.blurHeight;
    delete image.blurWidth;
    acc["images/" + key.replace(/^\.\//, "").normalize()] = image;
    return acc;
  }, {});

export { images };
