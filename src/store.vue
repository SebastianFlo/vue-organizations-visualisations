<script>
  export default {
    debug: {
      setFundersAction: false,
      setRecipientsAction: false,
      setFormattedDataAction: false,
      setRawDataAction: false,
      setRecipientColorAction: false,
      searchAction: false,
      setActiveDataAction: false,
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
      recipientTypes: [
        {
          color: '#ffbb78',
          name: 'Charity',
          index: 0
        },
        {
          color: '#2ca02c',
          name: 'Community Group',
          index: 1
        },
        {
          color: '#98df8a',
          name: 'Company / Mutual Society',
          index: 2
        },
        {
          color: '#d62728',
          name: 'Public Sector',
          index: 3
        },
        {
          color: '#ff9896',
          name: 'Non charitable unincorporated organisation',
          index: 4
        },
        {
          color: '#9467bd',
          name: 'Grassroots organisation',
          index: 5
        },
        {
          color: '#c5b0d5',
          name: 'CIC',
          index: 6
        },
      ]
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

    setRawDataAction(data) {
      if (this.debug.setRawDataAction) {
        console.log('setRawDataAction triggered with', data);
      }

      this.state.rawData = data;
    },

    setRecipientColorAction(name, color) {
      if (this.debug.setRecipientColorAction) {
        console.log('setRecipientColorAction triggered with', name, color);
      }

      const newColors = this.state.recipientTypes.map(recipient => {
        if (recipient.name === name) {
          recipient.color = color;
        };

        return recipient;
      });

      this.state.recipientTypes = newColors;
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
            funder: data.target.targetLinks,
            description: data.target.description,
            charityType: data.target.type
          },
          type: 2
        }

      }

      // If recipient
      else {
        this.state.active.data = {
          name: data.name,
          website: data.website,
          color: data.color,
          value: data.value,
          description: data.description,
          charityType: data.type,
          funder: data.targetLinks,
          type: 1
        }
      }
    },

  }
</script>
