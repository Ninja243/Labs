# Stuff I should change before moving to prod :shipit:
 * ## 1. MongoDB
   * ~Set up persistant storage using a volume so reboots don't get rid of everything~
   * Aggregation?
     - Would probably be more efficient than the way I'm currently handling it
 * ## 2. Go
   * Set up first run detection so that the privacy policy and other legal documents aren't forced into the DB whenever the API starts
 * ## 3. Docker
   * Load balancing
   * Consider switching to PODMAN
     - ~The humanoid packing device, not https://podman.io/
     - ~Actually pretty easy, remember to install `podman-compose` with the following command~
       - ~`pip3 install podman-compose`~
     - https://github.com/containers/podman-compose/issues/125
 * ## 4. React
   * Regen keys
     - All the keys, make *sure* you regen the secrets too
   * Actually check Nonce during auth
 * ## 5. Auth0
   * Narrow down API permissions
   * Change acceptable token sharing methods
