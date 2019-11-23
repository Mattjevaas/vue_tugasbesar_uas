<template>
    <v-app id="inspire">
        <v-navigation-drawer v-if="seen" v-model="drawer" app color="white">
              <template v-slot:prepend>
                <v-list-item two-line>
                <v-list-item-avatar>
                    <img :src="src">
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{nameuser}}</v-list-item-title>
                    <v-list-item-subtitle>Logged In</v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item router to="/userpage">
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Menu Pesan</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item router to="/useredit">
                    <v-list-item-action>
                        <v-icon>mdi-pencil</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Edit Profile</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <div class="pa-2">
                <v-btn block color="blue" style="margin-bottom: 40px" @click="logout">Logout</v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-app-bar app color="primary">
            <v-app-bar-nav-icon v-if="seen" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <img src="./assets/logo.svg" height="40" >
            <v-toolbar-title class="white--text ma-2">DigiPrint</v-toolbar-title>
            <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn v-if="seen2" rounded color="success" class="ma-2" dark v-on="on">Login</v-btn>
                    </template>
                    <v-card>
                        <v-card-title >
                        <span class="headline">Login !</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.email" label="Email" type="email" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field 
                                         v-model="form.password"
                                         :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                         :type="show2 ? 'text' : 'password'"
                                         @click:append="show2 = !show2"
                                         label="Password" outlined required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close1">Close</v-btn>
                                <v-btn color="blue darken-1" text @click="login">Submit</v-btn>
                            </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialog2" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn  v-if="seen2" rounded color="error" class="ma-2" dark v-on="on">Sign Up</v-btn>
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
                                        <v-text-field v-model="form.name" label="Nama Lengkap" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                         <v-text-field v-model="form.email" label="Email" type="email" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                         <v-text-field 
                                         v-model="form.password"
                                         :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                         :type="show2 ? 'text' : 'password'"
                                         @click:append="show2 = !show2"
                                         label="Password" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.no_telp" label="No Telepon" type="number" outlined required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea v-model="form.alamat" label="Alamat" outlined required></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close2">Close</v-btn>
                                <v-btn color="blue darken-1" text @click="sendData">Submit</v-btn>
                            </v-card-actions>
                    </v-card>
                </v-dialog>
        </v-app-bar>
        <v-content>
            <router-view/>
        </v-content>
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
    </v-app>
</template>

<script>

export default {
  data: () => ({
      dialog: false,
      dialog2: false,
      show2: false,
      drawer: false,
      seen: true,
      seen2: true,
      users: [],
      usr : null,
      snackbar: false,
      text:'',
      colorsnack: '',
      src:'',
      nameuser:'',
      timeout: 2000,
      form: { 
                name : '', 
                email : '', 
                password : '', 
                alamat: '',
                no_telp: '',
            }, 
      user : new FormData,
    }),
    methods:{
        login(){
                this.user.append('email', this.form.email); 
                this.user.append('password', this.form.password);
                var uri =this.$apiUrl + '/user/login' 
                this.load = true 
                this.$http.post(uri,this.user).then(response =>{ 
                    //this.$cookie.set('TOKEN', response.data.token);
                    
                    if(response.data.error==null)
                    {
                        this.colorsnack = "green"
                        this.dialog = false 
                        this.resetForm()
                        this.$session.set('jwt', response.data)
                        this.seen = true
                        this.seen2 = false
                        this.$router.push('userpage')
                        this.text = "Berhasil Login!"
                        this.snackbar = true
                        this.resetForm()
                    }
                    else
                    {
                        this.colorsnack = "red"
                        this.text = "Invalid Username or Password!"
                        this.snackbar = true
                        console.log("test");
                        this.resetForm()
                    }
                    

                }) 
            },
        sendData(){ 
            this.user.append('name', this.form.name); 
            this.user.append('email', this.form.email);
            this.user.append('password', this.form.password);
            this.user.append('alamat', this.form.alamat);
            this.user.append('no_telp', this.form.no_telp);

            // const auth = {
            //     headers: {Authorization: this.$cookie.get('TOKEN')} 
            // }

            var uri =this.$apiUrl + '/user' 
            this.load = true 
            this.$http.post(uri,this.user).then(response =>{ 
                
                if(response.data.error==null)
                {
                    this.colorsnack = "green"
                    this.dialog2 = false 
                    this.text = 'Berhasil Mendaftar !'; 
                    this.snackbar = true; 

                    this.resetForm()
                }
                else
                {
                    this.colorsnack = "red"
                    this.text = 'Gagal Mendaftar !'; 
                    this.snackbar = true; 
                    this.resetForm()
                }
            
            }).catch(error =>{ 
                this.errors = error
                this.colorsnack = "red"
                this.text = 'Gagal Mendaftar !'; 
                this.snackbar = true; 
                this.resetForm()
            }) 
         },
         resetForm(){
                this.form =  { 
                name : '', 
                email : '', 
                password : '', 
                alamat: '',
                no_telp: '',
            }
         },
         logout(){
             this.$session.destroy()
             this.$router.push('/')
             location.reload()
         },
         getData(){
            var uri = this.$apiUrl + '/user/getUser/' + this.$session.get('jwt').data.id
            this.$http.get(uri).then(response =>{ 
            this.nameuser = response.data.data.name
            this.src = response.data.data.photo
            })
         },
         close1(){
            this.dialog = false
         },
         close2(){
            this.dialog2 = false
         },
    },
    mounted(){
        
        if(this.$session.get('jwt')==null)
        {
            this.seen = false
            this.seen2 = true
            this.drawer = false
        }
        else{
            this.getData()
            this.seen = true
            this.seen2 = false
            this.drawer = true
        }
    }

};
</script>