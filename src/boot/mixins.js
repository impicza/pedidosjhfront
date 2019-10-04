const axios = require('axios')

export const globalFunctions = {
  methods: {
    globalCapitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      value = value.toLowerCase()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    globalValidate (text, id = null, noValidate = 0) {
      this.$q.dialog({
        message: '¿ Quieres ' + text + ' este item ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (text === 'guardar') {
          this.globalStoreItem(noValidate)
        } else if (text === 'eliminar') {
          this.globalDeleteItem(id)
        } else if (text === 'editar') {
          this.globalGetItemInfo(id)
        } else if (text === 'inactivar') {
          this.globalEditEstateItem(id, 'inactivar')
        } else if (text === 'activar') {
          this.globalEditEstateItem(id, 'activar')
        } else if (text === 'guardar-edicion') {
          this.globalStoreItemEdit(noValidate, id)
        }
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    goblalValidarEstado (id) {
      const item = this.tableData.find(item => item.id === id)
      return item.activo
    },
    async globalEditEstateItem (id, text) {
      try {
        let response = await axios.get(this.$store.state.pedidosjh.url + this.urlAPI + '/estado/' + id + '/' + text)
        if (response.data === true) {
          this.$q.notify({ color: 'primary', message: 'item modificado!' })
        } else {
          this.$q.notify({ color: 'negative', message: 'Hubo un error no se pudo ' + text })
        }
      } catch (error) {
        this.$q.notify({ color: 'negative', message: 'Hubo un error no se pudo ' + text })
      } finally {
        this.globalGetItems()
      }
    },
    async globalGetItemInfo (id) {
      try {
        let data = await axios.get(this.$store.state.pedidosjh.url + this.urlAPI + '/' + id)
        var response = data.data
        this.storeItems = response
        this.showForUpdate = true
      } catch (error) {
      } finally {
        this.$q.loading.hide()
        this.postEdit()
      }
    },
    async globalDeleteItem (id) {
      let data
      try {
        data = await axios.delete(this.$store.state.pedidosjh.url + this.urlAPI + '/' + id)
        if (data.data === 'done') {
          this.$q.notify({ color: 'positive', message: 'Item Eliminado!' })
        } else {
          this.$q.notify({ color: 'negative', message: data.data })
        }
      } catch (error) {
        this.$q.notify({ color: 'negative', message: 'Error de conexion!' })
      } finally {
        this.globalGetItems()
      }
    },
    async globalGetItems () {
      this.$q.loading.show()
      try {
        await axios.get(this.$store.state.pedidosjh.url + this.urlAPI).then((response) => {
          this.tableData = response.data
        })
      } catch (error) {
      } finally {
        this.$q.loading.hide()
      }
    },
    async globalStoreItem (noValidate = 0) {
      this.preSave()
      var itemNull = 0
      for (const prop in this.storeItems) {
        if (typeof this.storeItems[prop] === 'string') {
          this.storeItems[prop] = this.globalCapitalize(this.storeItems[prop])
        }
        if ((this.storeItems[prop] == null) && (noValidate !== 1)) {
          this.$q.notify({ color: 'negative', message: 'El campo ' + prop + ' debe tener algun valor.' })
          itemNull = 1
        }
      }
      if (itemNull !== 1) {
        this.$q.notify({ color: 'warning', message: 'Guardando item...' })
        try {
          let response = await axios.post(
            this.$store.state.pedidosjh.url + this.urlAPI, this.storeItems
          )
          if (response.data === 'done') { // si se desea restaurar el formulario el api debe devolver "done"
            for (const prop in this.storeItems) {
              if (typeof this.storeItems[prop] === 'object') {
                this.storeItems[prop] = []
              } else if (typeof this.storeItems[prop] === 'boolean') {
                this.storeItems[prop] = false
              } else {
                this.storeItems[prop] = null
              }
            }
            this.globalGetItems()
            this.$q.notify({ color: 'positive', message: 'item Guardado!' })
          } else if (response.data === 'doneNoRestore') { // si NO se desea restaurar el formulario el api debe devolver "doneNoRestore"
            this.globalGetItems()
            this.$q.notify({ color: 'positive', message: 'item Guardado!' })
          } else {
            this.$q.notify({ color: 'negative', message: response.data })
          }
        } catch (error) {
          this.$q.notify({ color: 'negative', message: 'Hubo un error no se pudo guardar!' })
        } finally {
        }
      }
      this.postSave()
    },
    async globalStoreItemEdit (noValidate = 0, id) {
      this.preSave()
      var itemNull = 0
      for (const prop in this.storeItems) {
        if (typeof this.storeItems[prop] === 'string') {
          this.storeItems[prop] = this.globalCapitalize(this.storeItems[prop])
        }
        if ((this.storeItems[prop] == null) && (noValidate !== 1)) {
          this.$q.notify({ color: 'negative', message: 'El campo ' + prop + ' debe tener algun valor.' })
          itemNull = 1
        }
      }
      if (itemNull !== 1) {
        this.$q.notify({ color: 'warning', message: 'Guardando item...' })
        try {
          let response = await axios.put(
            this.$store.state.pedidosjh.url + this.urlAPI + '/' + id, this.storeItems
          )
          if (response.data === 'done') { // si se desea restaurar el formulario el api debe devolver "done"
            for (const prop in this.storeItems) {
              if (typeof this.storeItems[prop] === 'object') {
                this.storeItems[prop] = []
              } else if (typeof this.storeItems[prop] === 'boolean') {
                this.storeItems[prop] = false
              } else {
                this.storeItems[prop] = null
              }
            }
            this.globalGetItems()
            this.$q.notify({ color: 'positive', message: 'item Guardado!' })
          } else if (response.data === 'doneNoRestore') { // si NO se desea restaurar el formulario el api debe devolver "doneNoRestore"
            this.globalGetItems()
            this.$q.notify({ color: 'positive', message: 'item Guardado!' })
          } else {
            this.$q.notify({ color: 'negative', message: response.data })
          }
        } catch (error) {
          this.$q.notify({ color: 'negative', message: 'Hubo un error no se pudo guardar!' })
        } finally {
          this.showForUpdate = false
        }
      }
      this.postSave()
    },
    async globalGetForSelect (url) {
      this.$q.loading.show()
      var list
      try {
        let data = await axios.get(this.$store.state.pedidosjh.url + url)
        // var response = data.data
        // response.forEach(element => {
        //   element.value = element.id
        //   element.label = element[fieldLabel]
        //   if (stamp === true) {
        //     element.stamp = element[stampLabel]
        //     console.log('hola')
        //   }
        // })
        list = await data.data
      } finally {
        this.$q.loading.hide()
        return list
      }
    },
    globalFormatPeso (value) {
      let val = parseFloat(value).toFixed(3)
      return val
    }
  }
}
