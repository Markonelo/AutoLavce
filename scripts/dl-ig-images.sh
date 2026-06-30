#!/usr/bin/env bash
# Downloads all Auto Lavce Instagram car images from the exported manifest
# into public/cars/<igcode>/<index>.jpg. Resumable: skips files already present.
set -u
MANIFEST="/c/Users/marko/Downloads/autolavce_images_manifest.txt"
ROOT="/c/Users/marko/AutoLavce/auto-lavce/public/cars"
mkdir -p "$ROOT"

total=$(wc -l < "$MANIFEST" | tr -d ' ')
ok=0; skip=0; fail=0; n=0

while IFS=$'\t' read -r code idx url; do
  [ -z "$code" ] && continue
  n=$((n+1))
  dir="$ROOT/$code"
  mkdir -p "$dir"
  out="$dir/$idx.jpg"
  if [ -s "$out" ]; then skip=$((skip+1)); continue; fi
  code_http=$(curl -s --retry 3 --retry-delay 1 -m 60 -o "$out" -w "%{http_code}" "$url")
  if [ "$code_http" = "200" ] && [ -s "$out" ]; then
    ok=$((ok+1))
  else
    fail=$((fail+1)); rm -f "$out"
    echo "FAIL $code/$idx http=$code_http" >> "$ROOT/_dl_errors.log"
  fi
  if [ $((n % 25)) -eq 0 ]; then echo "progress: $n/$total (ok=$ok skip=$skip fail=$fail)"; fi
done < "$MANIFEST"

echo "DONE: total=$total ok=$ok skip=$skip fail=$fail"
