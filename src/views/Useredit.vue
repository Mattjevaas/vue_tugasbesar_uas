<template> 
    <v-container> 
        <v-card
            class="mx-auto my-12"
            max-width="700"
        >
            <v-img
            height="250"
            :src="src"
            ></v-img>

            <v-card-title>Edit User Profile</v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="form.name" label="Nama Lengkap" outlined required ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                                <v-text-field  readonly disabled v-model="form.email" label="Email" type="email" outlined required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field  v-model="form.no_telp" label="No Telepon" type="number" outlined required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea  v-model="form.alamat" label="Alamat" outlined required></v-textarea>
                        </v-col>
                        <v-col cols="10">
                            Change Profile Picture : <br><br>
                            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                            <br><br>
                            <v-btn small color="success" @click="submitFile">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
             <v-btn style="margin:20px" large color="primary" @click="updateData">Save</v-btn>
            </v-card-actions>
        </v-card>

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
    </v-container>
</template>

<script> 
export default { 
    data () { 
        return { 
            timeout: 2000,
            colorsnack: '',
            file:'',
            dialog: false, 
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
            users: [],
            src: '', 
            snackbar: false, 
            color: null, 
            formData : new FormData,
            text: '', 
            load: false,
            datatemp: null,
            form: { 
                name : '', 
                email : '', 
                alamat: '',
                no_telp: '', 
            }, 
            user : new FormData, 
            typeInput: 'new', 
            errors : '', 
            updatedId : '', 
        } 
    }, 
    methods:{ 
        getData(){ 

            var uri = this.$apiUrl + '/user/getUser/' + this.$session.get('jwt').data.id
            this.$http.get(uri).then(response =>{ 
                this.form.name = response.data.data.name
                this.form.email = response.data.data.email
                this.form.alamat = response.data.data.alamat
                this.form.no_telp = response.data.data.no_telp
                this.src = response.data.data.photo

            }) 
        }, 
        updateData(){
            this.user.append('name', this.form.name); 
            this.user.append('no_telp', this.form.no_telp); 
            this.user.append('alamat', this.form.alamat);
            var uri = this.$apiUrl + '/user/' + this.$session.get('jwt').data.id; 
            this.$http.post(uri,this.user).then(response =>{

                if(response.data.error == false)
                {
                    this.colorsnack = "green"
                    this.text = "Success to change profile data!"
                    this.snackbar = true
                    this.getData()
                }
                else
                {
                    this.colorsnack = "red"
                    this.text = "Failed to change profile data!"
                    this.snackbar = true
                }
            }).catch(error =>{ 
                this.errors = error 
            }) 
        },
        submitFile(){
            this.formData.append('file', this.file);
            var uri = this.$apiUrl + '/user/uploadFile/' + this.$session.get('jwt').data.id

            this.$http.post(uri,this.formData).then(response =>{

                if(response.data.error == false)
                {
                    this.colorsnack = "green"
                    this.text = "Success to change profile picture!"
                    this.snackbar = true
                    this.getData()
                }
                else
                {
                    this.colorsnack = "red"
                    this.text = "Failed to change profile picture!"
                    this.snackbar = true
                }

                
            })
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
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