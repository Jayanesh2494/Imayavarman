import React from 'react';
import { Avatar as PaperAvatar } from 'react-native-paper';

interface AvatarProps {
  source?: string;
  label?: string;
  size?: number;
  icon?: string;
}

export function Avatar({ source, label, size = 64, icon }: AvatarProps) {
  if (source) {
    return <PaperAvatar.Image size={size} source={{ uri: source }} />;
  }

  if (icon) {
    return <PaperAvatar.Icon size={size} icon={icon} />;
  }

  if (label) {
    return <PaperAvatar.Text size={size} label={label} />;
  }

  return <PaperAvatar.Icon size={size} icon="account" />;
}
