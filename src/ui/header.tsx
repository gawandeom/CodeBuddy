import React from "react";
import { Box, Text } from "ink";

export default function Header() {
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        CodeBuddy
      </Text>

      <Text dimColor>AI coding assistant</Text>
    </Box>
  );
}