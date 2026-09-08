import { Box, Text } from "ink";
import { readFile } from "../filesystem/fileops.js";
import { diffLines } from "diff";

type DiffProps = {
  filePath: string;
  proposedContent: string;
};

export default function Diff({ filePath, proposedContent }: DiffProps) {
  let originalContent: string;

  try {
    originalContent = readFile(filePath);
  } catch {
    originalContent = "";
  }
  const changes = diffLines(originalContent, proposedContent);

  return (
    <Box>
      <Box flexDirection="column">
        {changes.map((change,index) =>
          change.added ? (
            <Text color="green" key={index}>{change.value}</Text>
          ) : change.removed ? (
            <Text color="red" key={index}>{change.value}</Text>
          ) : (
            <Text key={index}>{change.value}</Text>
          ),
        )}
      </Box>
    </Box>
  );
}
