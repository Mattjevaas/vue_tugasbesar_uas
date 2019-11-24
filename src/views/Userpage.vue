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
                        <span class="headline">Tambah Print</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.filename" label="Nama File" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                        v-model="form.tempat"
                                        :items="items"
                                        label="Tempat Print"
                                        outlined
                                        @change="changeLoc"
                                        ></v-select>
                                    </v-col>
                                     <v-col cols="12">
                                        <gmap-map
                                        :center="center"
                                        :zoom="20"
                                        style="width:100%;  height: 400px;"
                                        >
                                        <gmap-marker
                                            :key="index"
                                            v-for="(m, index) in markers"
                                            :position="m.position"
                                            
                                        ></gmap-marker>
                                        </gmap-map>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.ukuran" label="Ukuran" outlined required @change="calculatePrice"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                        v-model="form.warna"
                                        :items="items2"
                                        label="Warna"
                                        outlined
                                        @change="calculatePrice"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field disabled readonly v-model="form.harga" label="Harga" outlined required ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog2 = false">Close</v-btn>
                                <v-btn color="blue darken-1" text @click="sendData">Submit</v-btn>
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
          v-for="printz in filteredList"
          :key="printz.id"
          cols="12"
        >
          <v-card
            color="#26415d"
            dark
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="printz.filename"
                ></v-card-title>
                <v-btn style="margin-left: 10px" x-small text color="white" :href="printz.link">Download File</v-btn>
                <v-card-subtitle >Tempat : {{printz.tempat}}</v-card-subtitle>
                <v-card-subtitle >Ukuran : {{printz.ukuran}}</v-card-subtitle>
                <v-card-subtitle > Warna : {{printz.warna}}</v-card-subtitle>
                <v-card-subtitle >Harga : {{printz.harga}}</v-card-subtitle>
              </div>
            </div>

            <v-card-actions>
              <v-btn small v-if="printz.status == 0" color="red">Belum Diproses</v-btn>
              <v-btn small v-if="printz.status == 1" color="green">Sudah Diprint</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

            <div class="text-center">
            <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            :color="colorsnack"
            >
            {{ text }}
            <v-btn
                color="white"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
            </v-snackbar>
        </div>

      </v-row>
    </v-container> 
</div>
</template> 

<script> 
export default { 

    name: "GoogleMap",
    data () { 
        return { 
                    center: { lat: 45.508, lng: -73.587 },
                    markers: [],
                    places: [],
                    currentPlace: null,
                    map :null,
                    timeout: 2000,
                    colorsnack: '',
                    text:'',
                    items2: ['color' , 'greyscale'],
                    items: ['Mrican', 'Babarsari' , 'Kaliurang'],
                    dialog2: false, 
                    keyword: '',
                    file:'',
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
                        filename : '', 
                        tempat : '', 
                        ukuran : '',
                        warna : '',
                        harga : '', 
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
                    this.user.append('filename', this.form.filename); 
                    this.user.append('tempat', this.form.tempat);
                    this.user.append('ukuran', this.form.ukuran);
                    this.user.append('warna', this.form.warna);
                    this.user.append('harga', this.form.harga);
                    this.user.append('file', this.file); 

                    var uri = this.$apiUrl + '/prints/' +  this.$session.get('jwt').data.id

                    this.$http.post(uri,this.user).then(response =>{ 
                        if(response.data.error == false)
                        {
                            this.colorsnack = "green"
                            this.text = "Pesanan telah dimasukkan!"
                            this.snackbar = true
                            this.getData()
                            this.resetForm(); 
                            this.dialog2 =- false
                        }
                        else
                        {
                            this.colorsnack = "red"
                            this.text = "Pesanan gagal!"
                            this.snackbar = true
                            this.resetForm(); 
                        }
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
                        filename : '', 
                        tempat : '', 
                        ukuran : '',
                        warna : '',
                        harga : '', 
                    } 
                },
                handleFileUpload(){
                    this.file = this.$refs.file.files[0];
                },
                setPlace(place) {
                    this.currentPlace = place;
                    },
                addMarker() {
                    const marker = {
                    lat: -7.774186399999998,
                    lng: 110.4142359
                    };
                    this.markers.push({ position: marker });

                    const marker3 = {
                        lat: -7.611528600000001,
                        lng: 110.42681679999998
                    }
                    this.markers.push({ position: marker3 });

                    const marker2 = {
                        lat: -7.774186399999998,
                        lng: 110.4142359
                    }
                    this.markers.push({ position: marker2 });

                },
                geolocate: function() {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                    };
                });
                },
                changeLoc()
                {
                    if(this.form.tempat == "Babarsari")
                    {
                        this.center = {
                            lat: -7.774186399999998,
                            lng: 110.4142359
                        }
                    }
                    else if(this.form.tempat == "Kaliurang")
                    {
                        this.center = {
                            lat:  -7.7114023,
                            lng: 110.40858950000006
                        }
                    }
                    else if(this.form.tempat == "Mrican")
                    {
                        this.center = {
                             lat: -7.611528600000001,
                             lng: 110.42681679999998
                        }
                    }
                },
                calculatePrice()
                {
                    if(this.form.warna == "greyscale")
                    {
                        this.form.harga = 5000 * this.form.ukuran * 1000
                    }
                    else if(this.form.warna == "color")
                    {
                        this.form.harga = 10000 * this.form.ukuran * 1000
                    }
                    else
                    {
                        this.form.harga = this.form.ukuran * 1000
                    }
                }

        },
        computed:{
            filteredList(){
                return this.prints.filter(prints =>{
                    return prints.filename.toLowerCase().includes(this.keyword.toLowerCase())
                })
            }
        },
        mounted(){ 
            if(this.$session.get('jwt')==null || this.$session.get('jwt').data.stat_admin!="User")
            {
                this.$router.push('/')
            }
            this.geolocate();
            this.addMarker();
            this.getData(); 
        }, 
    } 
</script>
