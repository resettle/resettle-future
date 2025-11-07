#!/bin/bash

# Script to build .env file from encrypted staging and production env files
# Uses dotenvx to decrypt and maps generic DIRECTUS_* variables to environment-specific names
# Example: DIRECTUS_KEY from .env.staging becomes DIRECTUS_STAGING_KEY

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building .env file for Directus...${NC}"

# Initialize .env file
ENV_FILE=".env"
> "$ENV_FILE"

# Add header
cat >> "$ENV_FILE" << 'EOF'
# Auto-generated .env file for Directus
# Generated from encrypted staging and production env files
# DO NOT EDIT MANUALLY - Run build-env.sh to regenerate

EOF

# Function to transform and extract Directus variables
# Args: $1 = env file path, $2 = prefix (STAGING or PRODUCTION)
extract_and_transform() {
    local ENV_PATH=$1
    local PREFIX=$2
    local COUNT=0

    if [ ! -f "$ENV_PATH" ]; then
        echo -e "${RED}⚠ $ENV_PATH file not found${NC}" >&2
        return 0
    fi

    echo -e "${BLUE}Processing $PREFIX environment...${NC}" >&2

    # Decrypt and process variables
    while IFS= read -r line; do
        # Skip empty lines and comments
        if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
            continue
        fi

        # Check if line starts with DIRECTUS_
        if [[ "$line" =~ ^DIRECTUS_([A-Z_0-9]+)=(.*) ]]; then
            VAR_NAME="${BASH_REMATCH[1]}"
            VAR_VALUE="${BASH_REMATCH[2]}"

            # Transform: DIRECTUS_KEY -> DIRECTUS_STAGING_KEY (or PRODUCTION)
            NEW_VAR_NAME="DIRECTUS_${PREFIX}_${VAR_NAME}"
            echo "${NEW_VAR_NAME}=${VAR_VALUE}" >> "$ENV_FILE"
            ((COUNT++))
        fi
    done < <(pnpm dotenvx decrypt -f "$ENV_PATH" --stdout)

    if [ $COUNT -gt 0 ]; then
        echo -e "${GREEN}✓ Extracted and transformed $COUNT variables${NC}" >&2
    else
        echo -e "${RED}⚠ No DIRECTUS_* variables found${NC}" >&2
    fi

    echo $COUNT
}

# Process staging environment
echo "" >> "$ENV_FILE"
echo "# Staging" >> "$ENV_FILE"
STAGING_COUNT=$(extract_and_transform "../../.env.staging" "STAGING")

# Process production environment
echo "" >> "$ENV_FILE"
echo "# Production" >> "$ENV_FILE"
PRODUCTION_COUNT=$(extract_and_transform "../../.env.production" "PRODUCTION")

# Add final newline
echo "" >> "$ENV_FILE"

echo ""
echo -e "${GREEN}✓ .env file created successfully at: $ENV_FILE${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "  Staging: $STAGING_COUNT variables"
echo -e "  Production: $PRODUCTION_COUNT variables"
echo -e "  Total: $((STAGING_COUNT + PRODUCTION_COUNT)) variables"
