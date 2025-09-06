import React from "react";
import {
  Typography, Stack, Alert, Table, TableBody, TableCell, TableHead, TableRow, Link as MuiLink, Chip
} from "@mui/material";
import UrlBatchForm from "../components/UrlBatchForm.jsx";
import { upsert, codeExists, loadAll } from "../services/storage.js";
import { makeUniqueCode, minutesToExpiryTS, fmt } from "../services/shortener.js";
import { useLogger } from "../services/logger.js";

export default function ShortenPage() {
  const [created, setCreated] = React.useState([]);
  const [error, setError] = React.useState("");
  const { log } = useLogger();

  const handleSubmit = (rows) => {
    setError("");
    const out = [];
    for (const r of rows) {
      if (r.code && codeExists(r.code)) {
        setError(`Shortcode "${r.code}" already exists. Choose another.`);
        log("CODE_COLLISION", { code: r.code });
        return;
      }
    }
    for (const r of rows) {
      const code = makeUniqueCode(r.code?.trim());
      const record = {
        code,
        longUrl: r.url.trim(),
        createdAt: Date.now(),
        expiresAt: minutesToExpiryTS(r.validity),
        clicks: []
      };
      upsert(record);
      log("CREATE_SHORT", { code, longUrl: record.longUrl, validityMins: r.validity });
      out.push(record);
    }
    setCreated(out);
  };

  const all = loadAll();

  return (
    <Stack spacing={3}>
      <Typography variant="h4">URL Shortener</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <UrlBatchForm onSubmit={handleSubmit} />

      {created.length > 0 && (
        <>
          <Typography variant="h6">New Short Links</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {created.map(r => (
                <TableRow key={r.code}>
                  <TableCell>
                    <MuiLink href={`${window.location.origin}/${r.code}`} target="_blank" rel="noreferrer">
                      {window.location.origin}/{r.code}
                    </MuiLink>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <MuiLink href={r.longUrl} target="_blank" rel="noreferrer">{r.longUrl}</MuiLink>
                  </TableCell>
                  <TableCell>{fmt(r.createdAt)}</TableCell>
                  <TableCell>{fmt(r.expiresAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {all.length > 0 && (
        <>
          <Typography variant="h6">All Your Short Links (this device)</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {all.map(r => {
                const expired = Date.now() > r.expiresAt;
                return (
                  <TableRow key={r.code}>
                    <TableCell>
                      <MuiLink href={`${window.location.origin}/${r.code}`} target="_blank" rel="noreferrer">
                        {window.location.origin}/{r.code}
                      </MuiLink>
                    </TableCell>
                    <TableCell>{r.clicks?.length || 0}</TableCell>
                    <TableCell>
                      <Chip size="small" color={expired ? "error" : "success"} label={expired ? "Expired" : "Active"} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </Stack>
  );
}
