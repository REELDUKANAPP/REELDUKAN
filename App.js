import React,{useEffect,useRef,useState}from"react";
import{Alert,Animated,FlatList,Image,Modal,Pressable,SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,TextInput,View}from"react-native";
import*as ImagePicker from"expo-image-picker";
import*as DocumentPicker from"expo-document-picker";

const CITIES=["Prayagraj","Lucknow","Varanasi","Kanpur","Agra","Ayodhya","Gorakhpur","Meerut","Noida","Delhi","Jaipur","Mumbai","Pune","Hyderabad","Bengaluru","Kolkata"];
const ANIMS=[["zoom","Zoom"],["slide","Slide"],["fade","Fade"],["pulse","Pulse"]];

export default function App(){
 const[city,setCity]=useState("Prayagraj"),[cityOpen,setCityOpen]=useState(false),[photos,setPhotos]=useState([]);
 const[text,setText]=useState(""),[anim,setAnim]=useState("zoom"),[music,setMusic]=useState(null),[active,setActive]=useState(0),[busy,setBusy]=useState(false);
 const scale=useRef(new Animated.Value(1)).current,opacity=useRef(new Animated.Value(1)).current,x=useRef(new Animated.Value(0)).current,progress=useRef(new Animated.Value(0)).current;
 useEffect(()=>{scale.setValue(1);opacity.setValue(anim==="fade"?0.2:1);x.setValue(anim==="slide"?30:0);
  Animated.parallel([Animated.timing(scale,{toValue:anim==="zoom"?1.08:anim==="pulse"?1.04:1,duration:900,useNativeDriver:true}),Animated.timing(opacity,{toValue:1,duration:900,useNativeDriver:true}),Animated.timing(x,{toValue:0,duration:700,useNativeDriver:true})]).start()
 },[active,anim]);
 async function pickPhotos(){if(photos.length>=10)return Alert.alert("अधिकतम 10 फोटो","एक Reel में 1 से 10 फोटो रखें।");
  const r=await ImagePicker.launchImageLibraryAsync({mediaTypes:["images"],allowsMultipleSelection:true,selectionLimit:10-photos.length,quality:1,orderedSelection:true});
  if(!r.canceled){setPhotos([...photos,...r.assets].slice(0,10));setActive(0)}
 }
 async function pickMusic(){const r=await DocumentPicker.getDocumentAsync({type:["audio/*"],copyToCacheDirectory:true});if(!r.canceled)setMusic(r.assets[0])}
 function remove(i){const a=photos.filter((_,n)=>n!==i);setPhotos(a);setActive(Math.max(0,Math.min(active,a.length-1)))}
 function create(){if(!photos.length)return Alert.alert("पहले फोटो चुनें","कम से कम 1 फोटो चुनना जरूरी है।");setBusy(true);progress.setValue(0);
  Animated.timing(progress,{toValue:1,duration:1800,useNativeDriver:false}).start();
  setTimeout(()=>{setBusy(false);Alert.alert("Reel project तैयार है",`${photos.length} फोटो • ${city} • ${anim}${music?" • music":""}\n\nअगले EAS/native चरण में वास्तविक MP4 export जोड़ा जाएगा।`)},1900)
 }
 const cur=photos[active];
 return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content"/><ScrollView contentContainerStyle={s.page}>
  <View style={s.head}><View><Text style={s.brand}>ReelDukan</Text><Text style={s.sub}>अपनी फोटो से शानदार Reel बनाएं</Text></View><View style={s.logo}><Text style={s.logoT}>R</Text></View></View>
  <View style={s.card}><Text style={s.title}>📍 शहर चुनें</Text><Pressable style={s.select} onPress={()=>setCityOpen(true)}><Text style={s.selectT}>{city}</Text><Text style={s.chev}>⌄</Text></Pressable><Text style={s.hint}>Prayagraj default है; अलग-अलग शहर चुन सकते हैं।</Text></View>
  <View style={s.card}><View style={s.between}><Text style={s.title}>📸 Photos</Text><Text style={s.count}>{photos.length}/10</Text></View><Pressable style={s.black} onPress={pickPhotos}><Text style={s.blackT}>{photos.length?"और फोटो जोड़ें":"1–10 फोटो चुनें"}</Text></Pressable>
   <FlatList horizontal data={photos} keyExtractor={(a,i)=>a.uri+i} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingTop:12}} renderItem={({item,index})=><Pressable onPress={()=>setActive(index)} style={[s.thumbBox,index===active&&s.activeThumb]}><Image source={{uri:item.uri}} style={s.thumb}/><Pressable style={s.x} onPress={()=>remove(index)}><Text style={s.xT}>×</Text></Pressable><Text style={s.num}>{index+1}</Text></Pressable>}/>
  </View>
  <View style={s.previewCard}><View style={s.between}><Text style={s.pTitle}>Reel Preview</Text><Text style={s.ratio}>9:16</Text></View><View style={s.preview}>
   {cur?<Animated.View style={{width:"100%",height:"100%",transform:[{scale},{translateX:x}],opacity}}><Image source={{uri:cur.uri}} style={s.pic}/></Animated.View>:<View style={s.empty}><Text style={s.plus}>＋</Text><Text style={s.emptyT}>फोटो चुनकर Preview देखें</Text></View>}
   <View style={s.overlay}>{text?<Text style={s.caption}>{text}</Text>:null}<View style={s.badge}><Text style={s.badgeT}>📍 {city}</Text></View></View>
  </View></View>
  <View style={s.card}><Text style={s.title}>✍️ Text</Text><TextInput value={text} onChangeText={setText} placeholder="जैसे: Prayagraj की खूबसूरत यादें ❤️" placeholderTextColor="#999" style={s.input} maxLength={80}/></View>
  <View style={s.card}><Text style={s.title}>✨ Animation</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>{ANIMS.map(([id,label])=><Pressable key={id} onPress={()=>setAnim(id)} style={[s.chip,anim===id&&s.chipOn]}><Text style={[s.chipT,anim===id&&s.chipOnT]}>{label}</Text></Pressable>)}</ScrollView></View>
  <View style={s.card}><View style={s.between}><Text style={s.title}>🎵 Music</Text><Text style={s.opt}>Optional</Text></View><Pressable style={s.music} onPress={pickMusic}><Text style={s.musicT}>{music?"✓ "+music.name:"फोन से music चुनें"}</Text></Pressable></View>
  <Pressable style={[s.create,busy&&{opacity:.65}]} onPress={create} disabled={busy}><Text style={s.createT}>{busy?"Reel तैयार हो रही है…":"🎬 Create Reel"}</Text></Pressable>
  {busy?<View style={s.progress}><Text style={{fontWeight:"700"}}>Project render preparation…</Text><View style={s.track}><Animated.View style={[s.bar,{width:progress.interpolate({inputRange:[0,1],outputRange:["0%","100%"]})}]}/></View></View>:null}
  <Text style={s.footer}>ReelDukan • Android + iOS • Creator app</Text>
 </ScrollView>
 <Modal visible={cityOpen} transparent animationType="slide" onRequestClose={()=>setCityOpen(false)}><View style={s.modalBg}><View style={s.sheet}><View style={s.between}><Text style={s.modalTitle}>शहर चुनें</Text><Pressable onPress={()=>setCityOpen(false)}><Text style={s.close}>×</Text></Pressable></View><FlatList data={CITIES} keyExtractor={x=>x} renderItem={({item})=><Pressable style={[s.city,item===city&&s.cityOn]} onPress={()=>{setCity(item);setCityOpen(false)}}><Text style={[s.cityT,item===city&&s.cityOnT]}>{item}</Text>{item===city?<Text>✓</Text>:null}</Pressable>}/></View></View></Modal>
 </SafeAreaView>
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#f7f7fb"},page:{padding:16,paddingBottom:40},head:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:16},brand:{fontSize:30,fontWeight:"900",color:"#17151d"},sub:{color:"#6b6872",marginTop:3},logo:{width:48,height:48,borderRadius:16,backgroundColor:"#d9469b",alignItems:"center",justifyContent:"center"},logoT:{color:"#fff",fontSize:24,fontWeight:"900"},
 card:{backgroundColor:"#fff",borderRadius:20,padding:16,marginBottom:14,borderWidth:1,borderColor:"#eee"},title:{fontSize:18,fontWeight:"800",color:"#211e27",marginBottom:10},between:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},count:{fontWeight:"800",color:"#d9469b"},select:{height:52,borderRadius:14,backgroundColor:"#f5f4f8",paddingHorizontal:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},selectT:{fontSize:16,fontWeight:"700"},chev:{fontSize:24,color:"#777"},hint:{color:"#777",marginTop:8,fontSize:12},black:{height:48,borderRadius:14,backgroundColor:"#19161e",alignItems:"center",justifyContent:"center"},blackT:{color:"#fff",fontWeight:"800"},thumbBox:{marginRight:10,borderRadius:14,padding:2,borderWidth:2,borderColor:"transparent",position:"relative"},activeThumb:{borderColor:"#d9469b"},thumb:{width:74,height:94,borderRadius:11},x:{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:11,backgroundColor:"#000b",alignItems:"center",justifyContent:"center"},xT:{color:"#fff",fontSize:17},num:{position:"absolute",left:8,bottom:8,color:"#fff",fontWeight:"900",textShadowColor:"#000",textShadowRadius:4},
 previewCard:{backgroundColor:"#17151d",borderRadius:22,padding:14,marginBottom:14},pTitle:{color:"#fff",fontSize:17,fontWeight:"800"},ratio:{color:"#bbb",fontWeight:"700"},preview:{height:430,borderRadius:18,overflow:"hidden",backgroundColor:"#2a2730",alignItems:"center",justifyContent:"center",position:"relative"},pic:{width:"100%",height:"100%",resizeMode:"cover"},empty:{alignItems:"center"},plus:{fontSize:44,color:"#aaa"},emptyT:{color:"#aaa"},overlay:{position:"absolute",left:16,right:16,bottom:18,alignItems:"center"},caption:{color:"#fff",fontSize:24,fontWeight:"900",textAlign:"center",textShadowColor:"#000",textShadowRadius:8,marginBottom:10},badge:{backgroundColor:"#000b",paddingHorizontal:12,paddingVertical:7,borderRadius:20},badgeT:{color:"#fff",fontWeight:"700",fontSize:12},
 input:{backgroundColor:"#f5f4f8",borderRadius:14,paddingHorizontal:14,minHeight:52,fontSize:15,color:"#222"},chip:{paddingHorizontal:18,paddingVertical:11,borderRadius:22,backgroundColor:"#f1f0f5"},chipOn:{backgroundColor:"#d9469b"},chipT:{fontWeight:"700",color:"#555"},chipOnT:{color:"#fff"},opt:{color:"#888",fontSize:12},music:{minHeight:50,borderRadius:14,paddingHorizontal:14,justifyContent:"center",backgroundColor:"#f5f4f8"},musicT:{fontWeight:"700",color:"#3d3944"},create:{height:58,borderRadius:18,backgroundColor:"#d9469b",alignItems:"center",justifyContent:"center"},createT:{color:"#fff",fontSize:18,fontWeight:"900"},progress:{backgroundColor:"#fff",padding:16,borderRadius:16,marginTop:12},track:{height:8,backgroundColor:"#eee",borderRadius:4,overflow:"hidden",marginTop:10},bar:{height:8,backgroundColor:"#d9469b"},footer:{textAlign:"center",color:"#999",marginTop:18,fontSize:12},
 modalBg:{flex:1,backgroundColor:"#0007",justifyContent:"flex-end"},sheet:{backgroundColor:"#fff",borderTopLeftRadius:26,borderTopRightRadius:26,padding:18,maxHeight:"75%"},modalTitle:{fontSize:22,fontWeight:"900"},close:{fontSize:32,color:"#555"},city:{paddingVertical:15,paddingHorizontal:12,borderBottomWidth:1,borderBottomColor:"#eee",flexDirection:"row",justifyContent:"space-between"},cityOn:{backgroundColor:"#fff0f8",borderRadius:12},cityT:{fontSize:16,color:"#333"},cityOnT:{color:"#d9469b",fontWeight:"900"}
});