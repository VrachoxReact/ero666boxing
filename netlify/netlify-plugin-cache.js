module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Restoring cached dependencies...');
    const success = utils.cache.restore('node_modules');
    console.log(`Cache ${success ? 'restored' : 'not restored'}`);
  },
  onPostBuild: ({ utils }) => {
    console.log('Caching dependencies...');
    const success = utils.cache.save('node_modules');
    console.log(`Cache ${success ? 'saved' : 'not saved'}`);
  }
}; 