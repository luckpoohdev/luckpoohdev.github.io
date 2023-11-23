module.exports = {
  apps : [{
    name: 'paypilot',
    script: 'yarn',
	  args: 'start',
	  interpreter: 'bash',
    instances: 1,
    watch: true,
  }],
};