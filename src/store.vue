<script>
  export default {
    debug: {
      setFundersAction: false,
      setRecipientsAction: false,
      setFormattedDataAction: false,
      searchAction: true,
    },
    state: {
      funders: [],
      recipients: [],
      active: {
        el: null,
        data: {}
      },
      searchId: '',
      formattedData: {},
      chart: {
        svg: null
      }
    },
    setFundersAction(funders) {
      if (this.debug.setFundersAction) {
        console.log('setFundersAction triggered with', funders);
      }

      this.state.funders = funders;
    },

    setRecipientsAction(recipients) {
      if (this.debug.setRecipientsAction) {
        console.log('setRecipientsAction triggered with', recipients);
      }

      this.state.recipients = recipients;
    },

    setFormattedDataAction(data) {
      if (this.debug.setFormattedDataAction) {
        console.log('setFormattedDataAction triggered with', data);
      }

      this.state.recipients = data;
    },

    searchAction(name) {
      if (this.debug.searchAction) {
        console.log('searchAction triggered with', name);
      }

      this.state.searchId = name;
    },

  }
</script>
