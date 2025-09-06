import React from "react";
import {
  Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Stack, Paper, TableContainer, Chip, Accordion, AccordionSummary, AccordionDetails, Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { loadAll } from "../services/storage.js";
import { fmt } from "../services/shortener.js";
import { useLogger } from "../services/logger.js";

export default function StatsPage() {
  const [list, setList] = React.useState(loadAll());
  const { logs, clearLogs, log } = useLogger();

  React.useEffect(() => { log("VIEW_STATS"); }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Statistics</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(r => (
              <TableRow key={r.code}>
                <TableCell>{window.location.origin}/{r.code}</TableCell>
                <TableCell>{fmt(r.createdAt)}</TableCell>
                <TableCell>{fmt(r.expiresAt)}</TableCell>
                <TableCell>{r.clicks?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">Click Details</Typography>
      {list.map(r => (
        <Accordion key={r.code}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ mr: 2 }}>{window.location.origin}/{r.code}</Typography>
            <Chip size="small" label={`${r.clicks?.length || 0} clicks`} />
          </AccordionSummary>
          <AccordionDetails>
            {(!r.clicks || r.clicks.length === 0) ? (
              <Typography variant="body2">No clicks yet.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Location (coarse)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {r.clicks.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{fmt(c.ts)}</TableCell>
                      <TableCell>{c.source}</TableCell>
                      <TableCell>{c.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Typography variant="h6">Client Logs (from custom middleware)</Typography>
      <Button onClick={clearLogs} sx={{ mb: 1 }} variant="outlined">Clear Logs</Button>
      <Paper variant="outlined" sx={{ p: 2, maxHeight: 240, overflow: "auto", fontFamily: "monospace", fontSize: 12 }}>
        {logs.map((l, i) => (
          <div key={i}>
            [{new Date(l.ts).toLocaleTimeString()}] {l.event} {JSON.stringify(l.details)}
          </div>
        ))}
      </Paper>
    </Stack>
  );
}
