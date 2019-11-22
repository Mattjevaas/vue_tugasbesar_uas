<template> 
<div>
    <v-container>
        <h1 style="margin-bottom: 50px" class="text-md-center">Data Pesanan Print</h1> 
        <v-layout row wrap style="margin:10px"> 
            <v-col> 
                <v-dialog v-model="dialog2" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn
                        depressed 
                        dark 
                        rounded 
                        style="text-transform: none !important; margin-bottom: 20px" 
                        color = "green accent-3" 
                        v-on="on"
                        >
                        <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                            Tambah Pesanan
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title >
                        <span class="headline">Sign Up</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.name" label="Nama File" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                         <v-text-field v-model="form.email" label="Upload Image" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                        :items="items"
                                        label="Tempat Print"
                                        outlined
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.alamat" label="Harga" outlined required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog2 = false">Close</v-btn>
                                <v-btn color="blue darken-1" text @click="dialog2 = false">Submit</v-btn>
                            </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-text-field
                    solo
                    v-model="keyword"
                    label="Cari Pesanan"
                    append-icon="mdi-search"
                    rounded
                ></v-text-field>
            </v-col>
        </v-layout> 
    </v-container>
    <v-container> 
        <v-row dense>
        <v-col
          v-for="printz in prints"
          :key="printz.id"
          cols="12"
        >
          <v-card
            color="#1f7ad4"
            dark
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="printz.filename"
                ></v-card-title>
                <v-card-subtitle v-text="printz.link"></v-card-subtitle>
                <v-card-subtitle v-text="printz.harga"></v-card-subtitle>
              </div>
            </div>

            <v-card-actions>
              <v-btn v-if="printz.status == 0" color="red">Belum Diproses</v-btn>
              <v-btn v-if="printz.status == 1" color="green">Sudah Diprint</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>
    </v-container> 
</div>
</template> 

<script> 
export default { 
    data () { 
        return { 
                    items: ['mrican', 'babarsari' , 'kaliurang'],
                    dialog2: false, 
                    keyword: '', 
                    headers: [ 
                        { 
                            text: 'No', 
                            value: 'no', 
                        }, 
                        { 
                            text: 'File', 
                            value: 'file' 
                        }, 
                        { 
                            text: 'Tanggal', 
                            value: 'tanggal' 
                        }, 
                        { 
                            text: 'Harga', 
                            value: 'harga' 
                        }, 
                        { 
                            text: 'Lokasi', 
                            value: 'lokasi' 
                        },
                        { 
                            text: 'Status', 
                            value: null 
                        }, 
                    ], 
                    prints: [], 
                    snackbar: false, 
                    form: { 
                        name : '', 
                        email : '', 
                        password : '' 
                    }, 
                    user : new FormData, 
                } 
            }, 
            methods:{ 
                getData(){ 

                    var uri = this.$apiUrl + '/prints/' + this.$session.get('jwt').data.id
                    this.$http.get(uri).then(response =>{ 
                        this.prints=response.data.data
                    }) 
                }, 
                sendData(){ 
                    this.user.append('name', this.form.name); 
                    this.user.append('email', this.form.email);
                    this.user.append('password', this.form.password); 
                    const auth = {
                        headers: {Authorization: this.$cookie.get('TOKEN')} 
                    }
                    var uri =this.$apiUrl + '/user' 
                    this.load = true 
                    this.$http.post(uri,this.user,auth).then(response =>{ 
                        this.snackbar = true; //mengaktifkan snackbar 
                        this.color = 'green'; //memberi warna snackbar 
                        this.text = response.data.message; //memasukkan pesan ke snackbar 
                        
                        this.load = false; 
                        this.dialog = false 
                        this.getData(); //mengambil data user 
                        this.resetForm(); 
                    }).catch(error =>{ 
                        this.errors = error 
                        this.snackbar = true; 
                        this.text = 'Try Again'; 
                        this.color = 'red'; 
                        this.load = false; 
                    }) 
                }, 
                updateData(){ 
                    this.user.append('name', this.form.name); 
                    this.user.append('email', this.form.email); 
                    this.user.append('password', this.form.password);
                    const auth = {
                        headers: {Authorization: this.$cookie.get('TOKEN')} 
                    }
                    var uri = this.$apiUrl + '/user/' + this.updatedId; 
                    this.load = true 
                    this.$http.post(uri,this.user,auth).then(response =>{
                    this.snackbar = true; //mengaktifkan snackbar 
                    this.color = 'green'; //memberi warna snackbar 
                    this.text = response.data.message; //memasukkan pesan ke snackbar 
                    
                    this.load = false; this.dialog = false 
                    this.getData(); //mengambil data user 
                    this.resetForm(); this.typeInput = 'new'; 
                    }).catch(error =>{ 
                        this.errors = error 
                        this.snackbar = true; 
                        this.text = 'Try Again'; 
                        this.color = 'red'; 
                        this.load = false; 
                        this.typeInput = 'new'; 
                    }) 
                }, 
                deleteData(deleteId){ //menghapus data 
                const auth = {
                        headers: {Authorization: this.$cookie.get('TOKEN')} 
                    }
                    var uri = this.$apiUrl + '/user/' + deleteId; //data dihapus berdasarkan id 
                    this.$http.delete(uri,auth).then(response =>{ 
                        this.snackbar = true; 
                        this.text = response.data.message; 
                        this.color = 'green' 
                        this.deleteDialog = false; 
                        this.getData(); 
                    }).catch(error =>{ 
                        this.errors = error 
                        this.snackbar = true; 
                        this.text = 'Try Again'; 
                        this.color = 'red'; 
                    }) 
                },
                resetForm(){ 
                    this.form = { 
                        name : '', 
                        email : '', 
                        password : '' 
                    } 
                } 
        }, 
        mounted(){ 
            this.getData(); 
        }, 
    } 
</script>