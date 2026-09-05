import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export default function Input({
  value,
  onChange,
  onSubmit,
}: InputProps) {
  return (
    <Box>
      <Text color="cyan">❯ </Text>

      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Box>
  );
}