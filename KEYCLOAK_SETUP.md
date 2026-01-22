# Keycloak Configuration Guide for PDS

## Step 1: Access Keycloak Admin Console

1. Open your browser and go to: `http://localhost:8080`
2. Click on "Administration Console"
3. Login with:
   - Username: `admin`
   - Password: `admin`

## Step 2: Create Realm

1. Hover over "master" in the top-left corner
2. Click "Create Realm"
3. Enter realm name: `pds-realm`
4. Click "Create"

## Step 3: Create Client

1. Go to "Clients" in the left menu
2. Click "Create client"
3. Fill in:
   - Client ID: `pds-client`
   - Client Protocol: `openid-connect`
   - Click "Next"
4. Configure capability:
   - Client authentication: ON
   - Authorization: OFF
   - Standard flow: ON
   - Direct access grants: ON
   - Click "Next"
5. Configure login settings:
   - Valid redirect URIs: 
     * `http://localhost:3000/*`
     * `http://localhost:5173/*` (for Vite dev server)
   - Valid post logout redirect URIs: `http://localhost:3000/*`
   - Web origins: 
     * `http://localhost:3000`
     * `http://localhost:5173`
   - Click "Save"

## Step 4: Configure Client Roles

1. Go to the `pds-client` you just created
2. Click on the "Roles" tab
3. Click "Create role"
4. Create the following roles:
   - `ADMIN`
   - `DOCTOR`
   - `PATIENT`
   - `SECRETARY`
   - `SECURITY_OFFICER`

## Step 5: Create Realm Roles

1. Go to "Realm roles" in the left menu
2. Click "Create role"
3. Create the same roles as above:
   - `ADMIN`
   - `DOCTOR`
   - `PATIENT`
   - `SECRETARY`
   - `SECURITY_OFFICER`

## Step 6: Configure Client Scopes

1. Go to "Client scopes" in the left menu
2. Click on `pds-client-dedicated`
3. Go to "Mappers" tab
4. Click "Add mapper" → "By configuration"
5. Select "User Realm Role"
6. Configure:
   - Name: `roles`
   - Token Claim Name: `roles`
   - Claim JSON Type: `String`
   - Add to ID token: ON
   - Add to access token: ON
   - Add to userinfo: ON
   - Click "Save"

## Step 7: Create Users

### Admin User
1. Go to "Users" in the left menu
2. Click "Create new user"
3. Fill in:
   - Username: `admin`
   - Email: `admin@pds.com`
   - Email verified: ON
   - First name: `Admin`
   - Last name: `User`
   - Click "Create"
4. Go to "Credentials" tab
5. Click "Set password"
   - Password: `admin123`
   - Temporary: OFF
   - Click "Save"
6. Go to "Role mapping" tab
7. Click "Assign role"
8. Select "Filter by realm roles"
9. Assign: `ADMIN` role
10. Click "Assign"

### Doctor User
Repeat the same process with:
- Username: `doctor`
- Email: `doctor@pds.com`
- Password: `doctor123`
- Role: `DOCTOR`

### Patient User
Repeat the same process with:
- Username: `patient`
- Email: `patient@pds.com`
- Password: `patient123`
- Role: `PATIENT`

## Step 8: Get Client Secret (Optional - for backend configuration)

1. Go to "Clients" → `pds-client`
2. Go to "Credentials" tab
3. Copy the "Client secret" value
4. Update your backend configuration if needed

## Step 9: Test Configuration

1. Open the frontend application: `http://localhost:3000`
2. Click "Sign In with Keycloak"
3. You should be redirected to Keycloak login
4. Login with one of the users you created
5. You should be redirected back to the application

## Troubleshooting

### Issue: "Invalid redirect URI"
**Solution**: Make sure you added `http://localhost:3000/*` to Valid Redirect URIs in client settings

### Issue: "CORS error"
**Solution**: Add `http://localhost:3000` to Web Origins in client settings

### Issue: "User not found"
**Solution**: Make sure you created the user and set their password (not temporary)

### Issue: "Access denied"
**Solution**: Make sure the user has the correct role assigned

### Issue: "Token validation failed"
**Solution**: 
1. Check that issuer-uri in backend matches Keycloak realm
2. Verify Keycloak is running and accessible
3. Check that the roles mapper is configured correctly

## Advanced Configuration

### Enable User Registration
1. Go to "Realm settings" → "Login" tab
2. Enable "User registration"
3. Users can now self-register

### Email Configuration
1. Go to "Realm settings" → "Email" tab
2. Configure SMTP settings
3. Enable email verification

### Password Policy
1. Go to "Realm settings" → "Password policy" tab
2. Add policies:
   - Minimum length: 8
   - Uppercase characters: 1
   - Digits: 1
   - Special characters: 1

### Session Management
1. Go to "Realm settings" → "Sessions" tab
2. Configure:
   - SSO Session Idle: 30 minutes
   - SSO Session Max: 10 hours

## Quick Reference

| Item | Value |
|------|-------|
| Realm Name | pds-realm |
| Client ID | pds-client |
| Keycloak URL | http://localhost:8080 |
| Admin Username | admin |
| Admin Password | admin |
| Test Users | admin@pds.com, doctor@pds.com, patient@pds.com |
| Test Password | {username}123 |

## Security Best Practices

1. ⚠️ **Change default admin password** in production
2. ⚠️ **Use HTTPS** in production
3. ⚠️ **Enable email verification** for user registration
4. ⚠️ **Configure strong password policies**
5. ⚠️ **Enable audit logging**
6. ⚠️ **Regular backup** of Keycloak database
7. ⚠️ **Use client secret** for backend-to-backend communication

## Additional Resources

- Keycloak Documentation: https://www.keycloak.org/documentation
- Spring Security OAuth2: https://spring.io/projects/spring-security-oauth
- JWT.io: https://jwt.io (for debugging tokens)

---

**Configuration complete! Your PDS system is now ready to use.**
