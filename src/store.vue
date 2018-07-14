<script>
  export default {
    debug: {
      setFundersAction: false,
      setRecipientsAction: false,
      setFormattedDataAction: false,
      setRawData: false,
      searchAction: false,
      setActiveDataAction: true,
    },
    state: {
      funders: [],
      recipients: [],
      active: {
        el: null,
        data: {}
      },
      searchId: '',
      rawData: {},
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

      this.state.formattedData = data;
    },

    setRawData(data) {
      if (this.debug.setRawData) {
        console.log('setRawData triggered with', data);
      }

      this.state.rawData = data;
    },

    searchAction(name) {
      if (this.debug.searchAction) {
        console.log('searchAction triggered with', name);
      }

      this.state.searchId = {
        name
      };
    },

    setActiveDataAction(data) {
      if (this.debug.setActiveDataAction) {
        console.log('setActiveDataAction triggered with', data);
      }

      if (!data) {
        this.state.active.data = {};
      }

      // If Funder
      if (data.recipients) {
        this.state.active.data = {
          name: data.name,
          logo: data.logo,
          color: data.color,
          website: data.website,
          value: data.value,
          recipients: data.recipients,
          type: 0,
        }
      }

      // If Link
      else if (data.source && data.target) {
        this.state.active.data = {
          source: {
            name: data.source.name,
            logo: data.source.logo,
            color: data.source.color,
            website: data.source.website,
            value: data.source.value,
            recipients: data.source.recipients
          },
          target: {
            name: data.target.name,
            value: data.target.value,
            color: data.target.color,
            website: data.target.website,
            charityType: data.target.type
          },
          type: 2
        }
      }

      else {
        this.state.active.data = {
          name: data.name,
          website: data.website,
          color: data.color,
          value: data.value,
          recipients: data.recipients,
          charityType: data.type,
          funder: data.targetLinks,
          type: 1
        }
      }

    },

  }
</script>
