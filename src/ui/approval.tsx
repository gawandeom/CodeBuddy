import { Box, Text, useInput } from "ink";
import { writeFile } from "../filesystem/fileops.js";

type ApprovalProps = {
  filePath: string;
  onApprove: () => void;
  onReject: () => void;
};

export function Approval({filePath,onApprove,onReject}:ApprovalProps) {
  
    useInput((input, key) => {
      if (input === "y") {
        onApprove()
      }

      if (input === "n") {
        onReject()
      }
    });
  

  return (
    <>
      <Box>
        <Text> Apply Changes {filePath}? (y/n) </Text>
      </Box>
    </>
  );
}
