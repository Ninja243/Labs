# Stuff I should change before moving to prod :shipit:
 * ## 1. MongoDB
   * Set up persistant storage using a volume so reboots don't get rid of everything
 * ## Go
   * Set up first run detection so that the privacy policy and other legal documents aren't forced into the DB whenever the API starts
 * ## 2. Docker
   * Load balancing
   * Consider switching to PODMAN
     - The humanoid packing device, not https://podman.io/
 * ## 3. React
   * Regen keys
   * Actually check Nonce during auth
