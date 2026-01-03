#!/bin/bash

# Base URL
API_URL="http://localhost:3000/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Testing Authentication Endpoints..."

# 1. Login with correct credentials
echo -e "\n1. Testing Login..."
# Save cookies to cookie.txt
RESPONSE=$(curl -s -c cookie.txt -w "%{http_code}" -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}')

HTTP_CODE=${RESPONSE: -3}
BODY=${RESPONSE:0:${#RESPONSE}-3}

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}Login Successful (200)${NC}"
else
  echo -e "${RED}Login Failed ($HTTP_CODE)${NC}"
  echo "Body: $BODY"
  exit 1
fi

# 2. Check /me with cookie
echo -e "\n2. Testing /me endpoint with cookie..."
RESPONSE=$(curl -s -b cookie.txt -w "%{http_code}" $API_URL/auth/me)

HTTP_CODE=${RESPONSE: -3}
BODY=${RESPONSE:0:${#RESPONSE}-3}

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}/me check Successful (200)${NC}"
  # echo $BODY
else
  echo -e "${RED}/me check Failed ($HTTP_CODE)${NC}"
  echo "Body: $BODY"
  exit 1
fi

# 3. Access protected resource (projects) with cookie
echo -e "\n3. Testing protected resource (projects) with cookie..."
RESPONSE=$(curl -s -b cookie.txt -w "%{http_code}" $API_URL/projects)

HTTP_CODE=${RESPONSE: -3}
BODY=${RESPONSE:0:${#RESPONSE}-3}

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}Protected resource access Successful (200)${NC}"
else
  echo -e "${RED}Protected resource access Failed ($HTTP_CODE)${NC}"
  echo "Body: $BODY"
  exit 1
fi

# 4. Access protected resource WITHOUT cookie
echo -e "\n4. Testing protected resource WITHOUT cookie..."
RESPONSE=$(curl -s -w "%{http_code}" $API_URL/projects)

HTTP_CODE=${RESPONSE: -3}
BODY=${RESPONSE:0:${#RESPONSE}-3}

if [ "$HTTP_CODE" -eq 401 ] || [ "$HTTP_CODE" -eq 403 ]; then
  echo -e "${GREEN}Access correctly denied ($HTTP_CODE)${NC}"
else
  echo -e "${RED}Access NOT denied as expected ($HTTP_CODE)${NC}"
  echo "Body: $BODY"
  exit 1
fi

# 5. Logout
echo -e "\n5. Testing Logout..."
# Use cookie jar to send cookie, update cookie jar (should clear/expire) but curl -c doesn't always clear in file immediately for session cookies vs max-age.
# But endpoint should respond 200.
RESPONSE=$(curl -s -b cookie.txt -c cookie.txt -w "%{http_code}" -X POST $API_URL/auth/logout)

HTTP_CODE=${RESPONSE: -3}
if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}Logout Successful (200)${NC}"
else
  echo -e "${RED}Logout Failed ($HTTP_CODE)${NC}"
  exit 1
fi

echo -e "\n${GREEN}All Auth Tests Passed!${NC}"
rm cookie.txt
