import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { getByCode, recordClick } from "../services/storage.js";
import { Typography, Button, Stack, Alert, Link as MuiLink } from "@mui/material";
import { useLogger } from "../services/logger.js";

export default function RedirectPage() {
  const { code } = useParams();
  const [state, setState] = React.useState({ status: "loading", record: null, message: "" });
  const { log } = useLogger();

  React.useEffect(() => {
    const rec = getByCode(code);
    if (!rec) {
      log("REDIRECT_NOT_FOUND", { code });
      return setState({ status: "error", message: "Short link not found.", record: null });
    }
    if (Date.now() > rec.expiresAt) {
      log("REDIRECT_EXPIRED", { code });
      return setState({ status: "error", message: "This short link has expired.", record: rec });
    }

    // log the click before redirect
    const click = {
      ts: Date.now(),
      source: document.referrer ? new URL(document.referrer).host : "direct",
      location: Intl.DateTimeFormat().resolvedOptions().timeZone || "local"
    };
    recordClick(code, click);
    log("REDIRECT_OK", { code, source: click.source });

    // perform redirect
    window.location.replace(rec.longUrl);
  }, [code]);

  if (state.status === "loading") {
    return <Typography>Redirecting…</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Alert severity="error">{state.message}</Alert>
      {state.record && (
        <Typography>
          Original URL:{" "}
          <MuiLink href={state.record.longUrl} target="_blank" rel="noreferrer">
            {state.record.longUrl}
          </MuiLink>
        </Typography>
      )}
      <Button component={RouterLink} to="/" variant="contained">Create another short link</Button>
    </Stack>
  );
}
