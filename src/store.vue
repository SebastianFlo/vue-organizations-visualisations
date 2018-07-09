<script>
  export default {
    debug: true,
    state: {
      active: {},
      keepActiveItem: true
    },
    setActiveAction(newValue) {
      if (this.debug) {
        console.log('setActiveAction triggered with', newValue);
      }

      let activeData = {
        type: ''
      };

      if (newValue.source && newValue.target) {
        // If Link
        activeData.source = {
          name: newValue.source.name,
          recipients: newValue.source.recipients,
          value: newValue.source.value,
        };
        activeData.target = {
          name: newValue.target.name,
          value: newValue.target.value,
        };
        activeData.type = 'link';

      } else if (newValue.recipients) {
        // If Funder
        activeData.name = newValue.name;
        activeData.logo = newValue.logo;
        activeData.value = newValue.value;
        activeData.recipients = newValue.recipients;
        activeData.type = 'funder';

      } else {
        // If Funded
        activeData.name = newValue.name;
        activeData.value = newValue.value;
        activeData.type = 'funded';
        activeData.funder = newValue.targetLinks;
      }

      this.state.active = activeData;
    },
    clearActiveAction() {
      if (this.debug) {
        console.log('clearActiveAction triggered');
      }

      if (this.state.keepActiveItem) {
        return;
      }

      this.state.active = {};
    },
    setKeepActiveAction(newValue) {
      if (this.debug) {
        console.log('setKeepActiveAction triggered with', newValue);
      }

      this.state.keepActiveItem = newValue;
    }
  }
</script>
