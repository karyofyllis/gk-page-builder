import React, { useState } from "react";
import { Box, Button as MuiButton, IconButton, Input, Link } from "@material-ui/core";
import { HdrStrong, InsertLink, PaletteOutlined } from "@material-ui/icons";
import { useAnchor } from "../hooks";
import BlockControls from "../core/BlockControls";
import PropertyMenu from "../core/PropertyMenu";
import InsertDialog from "../core/InsertDialog";

function Button(props) {
  const {
    isEditing,
    handleRemoveBlock,
    id,
    properties,
    handleUpdateComponentProp,
  } = props;

  const {handleClick, handleClickAway, anchorEl} = useAnchor()

  const [openUrl, setOpenUrl] = useState(false);

  const value = properties?.text || "";
  const url = properties?.url || "";
  const variant = properties?.variant || variantProperty.options[0].value;
  const color = properties?.color || colorProperty.options[0].value;

  const handleChange = (e) => {
    const newValue = e.target.value;
    handleUpdateComponentProp(id, "text", newValue);
  };

  const handleDismissUrlDialog = (newValue) => {
    handleUpdateComponentProp(id, "url", newValue);
    setOpenUrl(false);
  };


  const propertyOptions = [
    {
      custom: (
        <Input placeholder={"Label"} onChange={handleChange} value={value} />
      ),
    },
    {
      custom: (
        <IconButton
          color={url ? "primary" : "default"}
          onClick={() => setOpenUrl(true)}
        >
          <InsertLink />
        </IconButton>
      ),
    },
    {
      element: (
        <PropertyMenu
          value={variant}
          property={variantProperty}
          onChange={(opt) =>
            handleUpdateComponentProp(id, "variant", opt.value)
          }
        />
      ),
    },
    {
      element: (
        <PropertyMenu
          value={color}
          property={colorProperty}
          onChange={(opt) => handleUpdateComponentProp(id, "color", opt.value)}
        />
      ),
    },
  ];

  return (
    <BlockControls
      onClickAway={handleClickAway}
      handleRemoveBlock={handleRemoveBlock}
      anchorEl={anchorEl}
      propertyOptions={propertyOptions}
      {...props}
    >
      {isEditing ? (
        <MuiButton variant={variant} color={color} onClick={handleClick}>
          {value}
        </MuiButton>
      ) : (
        <MuiButton
          component={url ? Link : Box}
          href={url || "#"}
          target={"_blank"}
          style={{ textDecoration: "none" }}
          variant={variant}
          color={color}
          onClick={handleClick}
        >
          {value}
        </MuiButton>
      )}
      <InsertDialog
        onClose={() => setOpenUrl(false)}
        onConfirm={handleDismissUrlDialog}
        initialValue={url}
        open={openUrl}
      />
    </BlockControls>
  );
}

export default Button;

const colorProperty = {
  icon: <PaletteOutlined />,
  label: "Color",
  options: [
    {
      label: "Primary",
      value: "primary",
    },
    {
      label: "Secondary",
      value: "secondary",
    },
    {
      label: "Default",
      value: "default",
    },
  ],
};

const variantProperty = {
  icon: <HdrStrong />,
  label: "Variant",
  options: [
    {
      label: "Outlined",
      value: "outlined",
    },
    {
      label: "Contained",
      value: "contained",
    },
    {
      label: "Default",
      value: "default",
    },
  ],
};
