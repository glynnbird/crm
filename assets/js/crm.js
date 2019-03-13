const APIURL = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/208a8d87f8067eeaa6751e18e1c4efba314ef5ec38793779f4b582b5d6074435/crm'

const markdownConverter = new showdown.Converter()

const splitID = (id) => {
  const bits = id.split(':')
  return bits[0]
}


const CRMAPIsearch = async (term) => {
  const data = await fetch(APIURL + '/search?query=' + encodeURIComponent(term))
  const obj = await data.json()
  return obj
}

const CRMAPIfetch = async (partition) => {
  const data = await fetch(APIURL + '/fetch?partition=' + encodeURIComponent(partition))
  const obj = await data.json()
  return obj
}

const CRMAPIaddnote= async (partition, title, description) => {
  const params = {
    partition: partition,
    title: title,
    description: description
  }
  const data = await fetch(APIURL + '/addnote', 
                           { 
                             method: 'POST', 
                             body: JSON.stringify(params),
                             headers: {
                              'Content-type': 'application/json'
                             }
                           })
  const obj = await data.json()
  return obj
}

const CRMAPIaddcontact= async (partition, name, email) => {
  const params = {
    partition: partition,
    name: name,
    email: email
  }
  const data = await fetch(APIURL + '/addcontact', 
                           { 
                             method: 'POST', 
                             body: JSON.stringify(params),
                             headers: {
                              'Content-type': 'application/json'
                             }
                           })
  const obj = await data.json()
  return obj
}

const CRMAPIaddlink= async (partition, title, url) => {
  const params = {
    partition: partition,
    title: title,
    url: url
  }
  const data = await fetch(APIURL + '/addlink', 
                           { 
                             method: 'POST', 
                             body: JSON.stringify(params),
                             headers: {
                              'Content-type': 'application/json'
                             }
                           })
  const obj = await data.json()
  return obj
}


// a single company in the search results
Vue.component('company-list-item', {
  props: ['name','partition'],
  methods: {
    chooseCompany: function(event, partition) {
      app.chooseCompany(event, partition)
    }
  },
  template: `<a v-on:click="chooseCompany($event, partition)" href="#" class="list-group-item list-group-item-action" >
               {{ partition }} - {{ name }}
             </a>`
})

// a contact 
Vue.component('company-contact', {
  props: ['name','email'],
  template: `
              <div class="card contact-card">
                <div class="card-header">
                  <i class="fas fa-user-circle"></i>
                  {{ name }} {{ email}}
                </div>
              </div> 
            `
})

// a link 
Vue.component('company-link', {
  props: ['name','url','ts'],
  template: `
              <div class="card link-card">
                <div class="card-header">
                  <i class="fas fa-link"></i>
                  {{ name }} {{ url }}
                </div>
              </div> 
            `
})

// a note 
Vue.component('company-note', {
  props: ['title','description','ts'],
  template: `
              <div class="card note-card">
                <div class="card-header">
                  <i class="fas fa-sticky-note"></i>
                  {{ title }}
                </div>
                <div class="card-body">
                  <p class="card-text" v-html="description"></p>
                </div>
              </div> 
            `
})
// a generic company-history tag
Vue.component('company-history', {
  props: {
    item: Object
  },
  template: `<span> {{item.id}}<company-contact v-if="item.type === 'contact'"
               v-bind:name="item.name"
               v-bind:email="item.email">
             </company-contact>
             <company-note v-else-if="item.type === 'note'"
               v-bind:title="item.title"
               v-bind:description="item.descriptionHTML"
               v-bind:ts="item.ts">
             </company-note>
             <company-link v-else-if="item.type === 'link'"
               v-bind:name="item.name"
               v-bind:url="item.url"
               v-bind:ts="item.ts">
             </company-link>
             </span>
            `
})

// an add note form
Vue.component('add-note-form', {
  data: function() {
    return {
      title: '',
      description: '',
      disabled: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      console.log('mounted')
      document.getElementById('add-note-title').focus()
    })
  },
  methods: {
    submit: async function(event) {
      event.preventDefault();
      this.disabled = true
      const response = await CRMAPIaddnote(app.companyPartition, this.title, this.description)
      const obj = {
        _id: response.id,
        _rev: response.rev,
        type: 'note',
        title: this.title,
        description: this.description,
        descriptionHTML: markdownConverter.makeHtml(this.description),
        ts: new Date().toISOString()
      }
      app.companyHistory.unshift(obj)
      app.currentForm = ''
    },
    cancel: function(event) {
      event.preventDefault();
      app.currentForm = ''
    }
  },
  template: `<div class="alert alert-secondary" role="alert">
              <form v-on:submit="submit">
                  <h2>Add Note</h2>
                  <div class="form-group">
                    <label for="add-note-title">Title</label>
                    <input v-model="title" type="text" class="form-control" id="add-note-title" placeholder="Enter note title">
                  </div>
                  <div class="form-group">
                    <label for="add-note-description">Description</label>
                    <textarea v-model="description" class="form-control" id="add-note-description" placeholder="Enter note description"></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" v-bind:disabled="disabled">Submit</button>
                  <button v-on:click="cancel" type="button" class="btn btn-secondary" v-bind:disabled="disabled">Cancel</button>
              </form>
             </div>
            `
})

// an add contact form
Vue.component('add-contact-form', {
  data: function() {
    return {
      name: '',
      email: '',
      disabled: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      document.getElementById('add-contact-name').focus()
    })
  },
  methods: {
    submit: async function(event) {
      event.preventDefault();
      this.disabled = true
      const response = await CRMAPIaddcontact(app.companyPartition, this.name, this.email)
      const obj = {
        _id: response.id,
        _rev: response.rev,
        type: 'contact',
        name: this.name,
        email: this.email,
        ts: new Date().toISOString()
      }
      app.companyHistory.unshift(obj)
      app.currentForm = ''
    },
    cancel: function(event) {
      event.preventDefault();
      app.currentForm = ''
    }
  },
  template: `<div class="alert alert-secondary" role="alert">
              <form v-on:submit="submit">
                  <h2>Add Contact</h2>
                  <div class="form-group">
                    <label for="add-contact-title">Name</label>
                    <input v-model="name" type="text" class="form-control" id="add-contact-name" placeholder="Enter contact name">
                  </div>
                  <div class="form-group">
                    <label for="add-contact-email">Email</label>
                    <input v-model="email" type="email" class="form-control" id="add-contact-email" placeholder="Enter contact email">
                  </div>
                  <button type="submit" class="btn btn-primary" v-bind:disabled="disabled">Submit</button>
                  <button v-on:click="cancel" type="button" class="btn btn-secondary" v-bind:disabled="disabled">Cancel</button>
              </form>
             </div>
            `
})

// an add link form
Vue.component('add-link-form', {
  data: function() {
    return {
      title: '',
      url: '',
      disabled: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      document.getElementById('add-link-title').focus()
    })
  },
  methods: {
    submit: async function(event) {
      event.preventDefault();
      this.disabled = true
      const response = await CRMAPIaddlink(app.companyPartition, this.title, this.url)
      const obj = {
        _id: response.id,
        _rev: response.rev,
        type: 'link',
        title: this.title,
        url: this.url,
        ts: new Date().toISOString()
      }
      app.companyHistory.unshift(obj)
      app.currentForm = ''
    },
    cancel: function(event) {
      event.preventDefault();
      app.currentForm = ''
    }
  },
  template: `<div class="alert alert-secondary" role="alert">
              <form v-on:submit="submit">
                  <h2>Add Link</h2>
                  <div class="form-group">
                    <label for="add-link-title">Title</label>
                    <input v-model="name" type="text" class="form-control" id="add-link-title" placeholder="Enter link title">
                  </div>
                  <div class="form-group">
                    <label for="add-link-url">URL</label>
                    <input v-model="url" type="url" class="form-control" id="add-link-url" placeholder="Enter link URL">
                  </div>
                  <button type="submit" class="btn btn-primary" v-bind:disabled="disabled">Submit</button>
                  <button v-on:click="cancel" type="button" class="btn btn-secondary" v-bind:disabled="disabled">Cancel</button>
              </form>
             </div>
            `
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    company: null,
    searchTerm: '',
    searchResults: [],
    mode: 'welcome',
    companyPartition: null,
    companyHistory: [],
    currentForm: ''
  },
  methods: {
    chooseCompany: async function(event, partition) {
      event.preventDefault();
      this.mode = 'searching'
      this.companyHistory = []
      this.companyPartition = partition
      const data = await CRMAPIfetch(this.companyPartition)
      this.company = data.rows[0].doc
      this.companyHistory = []
      for(var i in data.rows) {
        if (i > 0) {
          data.rows[i].doc.descriptionHTML = markdownConverter.makeHtml(data.rows[i].doc.description)
          this.companyHistory.push(data.rows[i].doc)
        }
      }
      this.mode = 'company'
    },
    searchSubmit: async function(event) {
      event.preventDefault();
      this.mode = 'searching'
      console.log('search submitted')
      console.log('searchTerm', this.searchTerm)
      const data = await CRMAPIsearch(this.searchTerm)
      this.searchResults = data.docs
      this.mode = 'searchResults'
      console.log(data)
    }
  },
  computed: {
    currentTabComponent: function () {
      return this.currentForm
    },
    // calculate single string for the address
    companyAddress: function() {
      if (this.company === null) {
        return ''
      }
      let keys = Object.keys(this.company.address)
      let retval = ''
      for(let i in keys) {
        if (this.company.address[keys[i]]) {
          if (retval.length > 0) {
            retval += ', '
          }
          retval += this.company.address[keys[i]]
        }
      }
      return retval
    },
    processedSearchResults: function() {
      const retval = []
      for(let i in this.searchResults) {
        const obj = {}
        Object.assign(obj, this.searchResults[i])
        obj._partition = splitID(obj._id)
        retval.push(obj)
      }
      return retval
    }
  }
})