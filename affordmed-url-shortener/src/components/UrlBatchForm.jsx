import React from "react";
import {
  Card, CardContent, CardHeader, Grid, TextField, IconButton, Button, Stack, Tooltip
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { isValidUrl, isValidCode } from "../services/shortener";
import { useLogger } from "../services/logger";

const emptyRow = () => ({ url: "", validity: "", code: "" });

export default function UrlBatchForm({ onSubmit }) {
  const [rows, setRows] = React.useState([emptyRow()]);
  const { log } = useLogger();

  const addRow = () => setRows(r => r.length < 5 ? [...r, emptyRow()] : r);
  const removeRow = (i) => setRows(r => r.length > 1 ? r.filter((_, idx) => idx !== i) : r);

  const handleChange = (i, field, value) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const validateRow = (row) => {
    if (!row.url) return "URL is required";
    if (!isValidUrl(row.url)) return "Invalid URL";
    if (row.code && !isValidCode(row.code)) return "Shortcode must be 3-20 [A-Za-z0-9_-]";
    if (row.validity && (!/^\d+$/.test(row.validity) || +row.validity <= 0)) return "Validity must be a positive integer (minutes)";
    return null;
  };

  const submit = () => {
    const payload = [];
    for (const row of rows) {
      if (!row.url.trim()) continue;
      const err = validateRow(row);
      if (err) {
        log("VALIDATION_FAIL", { row, err });
        alert(err);
        return;
      }
      payload.push({ ...row, validity: row.validity ? +row.validity : 30 });
    }
    if (!payload.length) return alert("Enter at least one URL.");
    log("SUBMIT_BATCH", { count: payload.length });
    onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader title="Create Short Links (up to 5 at once)" />
      <CardContent>
        <Stack spacing={2}>
          {rows.map((row, i) => (
            <Grid key={i} container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  label="Long URL"
                  placeholder="https://example.com/very/long/path"
                  fullWidth value={row.url}
                  onChange={e => handleChange(i, "url", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Validity (mins)"
                  placeholder="30"
                  fullWidth value={row.validity}
                  onChange={e => handleChange(i, "validity", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Preferred Shortcode (optional)"
                  placeholder="my-code"
                  fullWidth value={row.code}
                  onChange={e => handleChange(i, "code", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={1} sx={{ textAlign: { md: "right" } }}>
                <Tooltip title="Remove">
                  <span>
                    <IconButton disabled={rows.length === 1} onClick={() => removeRow(i)}>
                      <Remove />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
          <Stack direction="row" spacing={2}>
            <Button startIcon={<Add />} onClick={addRow} disabled={rows.length >= 5}>
              Add Row
            </Button>
            <Button variant="contained" onClick={submit}>
              Shorten All
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
