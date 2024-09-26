import * as React from "react";
import Avatar from "@mui/material/Avatar";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const nameParts = name.split(" ");
  const firstInitial = nameParts[0]?.[0]?.toUpperCase();
  const secondInitial = nameParts[1]?.[0]?.toUpperCase() || ""; // Empty string if second part doesn't exist

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${firstInitial}${secondInitial}`,
  };
}

export default function UserAvatar({ name }: { name: string }) {
  return <Avatar {...stringAvatar(name)} />;
}
