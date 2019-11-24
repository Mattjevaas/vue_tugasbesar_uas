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
                                <td>{{ item.name }}</td> 
                                <td>{{ item.email}}</td> 
                                <td>{{ item.no_telp }}</td> 
                                <td>
                                    <v-select
                                    style="width:110px; margin: 10px"
                                    v-model="item.stat_admin"
                                    :items="items2"
                                    label="Status"
                                    outlined
                                    @change="updateData(item.stat_admin,item.id)"
                                    ></v-select>
                                </td>
                                <td> 
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
                    text: 'Name', 
                    value: 'name' 
                }, 
                { 
                    text: 'Email', 
                    value: 'email' 
                }, 
                { 
                    text: 'No Telp', 
                    value: 'no_telp' 
                },
                { 
                    text: 'Status', 
                    value: 'stat_admin',
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
            var uri = this.$apiUrl + '/user' 
            this.$http.get(uri).then(response =>{ 
                this.users=response.data.message 
            }) 
        }, 
        updateData(data,id){ 
            this.user.append('stat_admin', data); 

            var uri = this.$apiUrl + '/user/updateStat/' + id; 
            this.$http.post(uri,this.user).then(response =>{
            this.snackbar = true; //mengaktifkan snackbar 
            this.color = 'green'; //memberi warna snackbar 
            this.text = response.data.msg; //memasukkan pesan ke snackbar 
            this.text = "Berhasil Ubah Role!"
            this.getData(); //mengambil data user 
        })
        }, 
        deleteData(deleteId){ //menghapus data 

            var uri = this.$apiUrl + '/user/' + deleteId; //data dihapus berdasarkan id 
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
        }, 
        mounted(){ 
            if(this.$session.get('jwt')==null || this.$session.get('jwt').data.stat_admin!="Admin")
            {
                this.$router.push('/')
            }
            this.getData();
        }, 
    } 
</script>