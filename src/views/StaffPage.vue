<template> 
    <v-container> 
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Data User</h2> 
                <v-layout row wrap style="margin:10px"> 

                    <v-flex xs6 class="text-right"> 
                        <v-text-field 
                            v-model="keyword"
                            append-icon="mdi-search"
                            label="Search" 
                            hide-details 
                        ></v-text-field>
                    </v-flex> 
                </v-layout> 
            
                <v-data-table 
                    :headers="headers" 
                    :items="users" 
                    :search="keyword"
                > 
                    <template v-slot:body="{ items }"> 
                        <tbody> 
                            <tr v-for="(item,index) in items" :key="item.id"> 
                                <td>{{ index + 1 }}</td> 
                                <td>{{ item.filename }}</td> 
                                <td><v-btn x-small text color="blue" :href="item.link">Download File</v-btn></td> 
                                <td>{{ item.tempat }}</td> 
                                <td>{{item.ukuran}}</td>
                                <td>{{item.warna}}</td>
                                <td>{{item.harga}}</td>
                                <td>{{item.name}}</td>
                                <td>
                                    <v-btn x-small color="blue" v-if="item.status == 0" @click="updateData(item.status,item.id)">Proses</v-btn>
                                    <v-btn x-small color="green" v-else-if="item.status == 1" >Selesai</v-btn>
                                </td>
                                <td > 
                                    <v-btn
                                        icon
                                        color="sucess"
                                        light 
                                        @click="cetakNota(item.id)"
                                    > 
                                        <v-icon>mdi-printer</v-icon>
                                    </v-btn>
                                    <v-btn
                                        icon
                                        color="error"
                                        light 
                                        @click="deleteData(item.id)"
                                    > 
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn> 
                                </td> 
                            </tr> 
                        </tbody> 
                    </template> 
                </v-data-table> 
            </v-container> 
        </v-card> 
        <v-snackbar 
            v-model="snackbar"
            :color="color" 
            :multi-line="true" 
            :timeout="3000"
        > 
            {{ text }} 
            <v-btn 
                dark 
                text 
                @click="snackbar = false" 
            > 
                Close 
            </v-btn> 
        </v-snackbar> 
    </v-container> 
</template> 

<script> 
export default { 
    data () { 
        return { 
            dialog: false, 
            keyword: '', 
            headers: [ 
                { 
                    text: 'No', 
                    value: 'no', 
                }, 
                { 
                    text: 'Fileame', 
                    value: 'filename' 
                }, 
                { 
                    text: 'File', 
                    value: 'file', 
                    sortable: false 
                }, 
                { 
                    text: 'Tempat', 
                    value: 'tempat' 
                },
                { 
                    text: 'Ukuran', 
                    value: 'ukuran',
                }, 
                { 
                    text: 'Warna', 
                    value: 'warna',
                }, 
                { 
                    text: 'Harga', 
                    value: 'harga'
                }, 
                { 
                    text: 'Pelanggan', 
                    value: 'pelanggan'
                },
                { 
                    text: 'Status', 
                    value: 'status',
                    sortable: false 
                },
                { 
                    text: 'Aksi', 
                    value: null,
                    sortable: false
                }, 
            ], 
            users: [], 
            items2: ['Admin','Staff','User'],
            snackbar: false, 
            color: null, 
            text: '', 
            user : new FormData, 
            stat: '',
        } 
    }, 
    methods:{ 
        getData(){ 
            var uri = this.$apiUrl + '/prints/dataPrint' 
            this.$http.get(uri).then(response =>{ 
                this.users=response.data.data 
            }) 
        }, 
        updateData(data,id){ 
            this.user.append('status', data); 
            var uri = this.$apiUrl + '/prints/updateStat/' + id; 
            this.$http.post(uri,this.user).then(response =>{
            this.snackbar = true; //mengaktifkan snackbar 
            this.color = 'green'; //memberi warna snackbar 
            this.text = response.data.msg; //memasukkan pesan ke snackbar 
            this.text = "Berhasil Ubah Status!"
            this.getData(); //mengambil data user 
        })
        }, 
        deleteData(deleteId){ //menghapus data 

            var uri = this.$apiUrl + '/prints/' + deleteId; //data dihapus berdasarkan id 
            this.$http.delete(uri).then(response =>{ 
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
        cetakNota(Id)
        {
            window.open(this.$apiUrl + "/prints/exportPdf/" +Id, "_blank"); 
        }
        }, 
        mounted(){ 
            
            if(this.$session.get('jwt')==null || this.$session.get('jwt').data.stat_admin!="Staff")
            {
                this.$router.push('/')
            }

            this.getData();
        }, 
    } 
</script>