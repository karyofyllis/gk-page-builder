import React from "react";

import {
  ArtTrack,
  CallToAction, Code,
  FormatTextdirectionLToR,
  GridOn,
  Image,
  List,
  Minimize,
  SpaceBarOutlined,
  TextFields,
  Title,
  ViewColumn
} from "@material-ui/icons";
import Paragraph from "./blocks/Paragraph";
import Grid from "./blocks/Grid";
import { makeid } from "./utils";
import Button from "./blocks/Button";
import ImageView from "./blocks/ImageView";
import Spacer from "./blocks/Spacer";
import Divider from "./blocks/Divider";
import BlockList from "./blocks/BlockList";
import SimpleGrid from "./blocks/SimpleGrid";
import MediaAndText from "./blocks/MediaAndText";
import RichText from "./blocks/RichText";
import PlainHtml from "./blocks/PlainHtml";
import Youtube from "./blocks/Youtube";
import YouTubeIcon from '@material-ui/icons/YouTube';

// text, heading, image, list, quote, code, buttons, gallery, divider;

export class Component {
  constructor(key, name, icon, render, properties = {}) {
    this.key = key;
    this.name = name;
    this.icon = icon;
    this.render = render;
    this.elements = [];
    this.id = makeid();
    this.properties = properties;
  }
}

const headingProps = {
  fontWeight: "bold",
  fontSize: 36,
};

const buttonProps = {
  text: "Label",
};

export const componentList = [
  new Component("title", "Title", <Title />, (props) => <Paragraph variant={"h3"} {...props} placeholder={"Enter title"} />, headingProps),
  new Component("paragraph", "Paragraph", <FormatTextdirectionLToR />, (props) => <Paragraph variant={"body1"} {...props} placeholder={"Enter paragraph"} />),
  new Component("grid", "Grid", <GridOn />, (props) => <Grid {...props} />),
  new Component("simpleGrid", "Simple Grid", <ViewColumn />, (props) => (<SimpleGrid {...props} />)),
  new Component("image", "Image", <Image />, (props) => (<ImageView {...props} />)),
  new Component("mediaAndText", "Media and Text", <ArtTrack />, (props) => (<MediaAndText {...props} />)),
  new Component("richText", "Rich Text", <TextFields />, (props) => (<RichText {...props} />), {colSize: 12}),
  new Component("list", "List", <List />, (props) => <BlockList {...props} />, {items: [""],}),
  new Component("button", "Button", <CallToAction />, (props) => <Button {...props} />, buttonProps),
  new Component("spacer", "Spacer", <SpaceBarOutlined />, (props) => <Spacer {...props} />, { padding: 1 }),
  new Component("divider", "Divider", <Minimize />, (props) => (<Divider {...props} />)),
  new Component("html", "Html", <Code />, (props) => (<PlainHtml {...props} />)),
  new Component("youtube", "Youtube", <YouTubeIcon />, (props) => (<Youtube {...props} />)),
];

const createMap = (array, prop = "id") =>
  new Map(array.map((item) => [item[prop], item]));

const componentMap = createMap(componentList, "key");

export const initState = (blocks) => {
  return blocks.map((block) => {
    const render = componentMap.get(block.key).render;
    return {
      ...block,
      render,
      elements: block.elements.map((nested) => {
        const render = componentMap.get(nested.key).render;
        return {
          ...nested,
          render,
          elements: nested.elements.map((sub) => {
            const render = componentMap.get(sub.key).render;
            return { ...sub, render };
          }),
        };
      }),
    };
  });
};
