import json,sys
S=sys.argv[1]; p=json.load(open(S+"/p2/"+sys.argv[2])); pos=p["pos"]; TOTAL=p["total"]
def st(k): return pos[k][0]
def en(k): return pos[k][1]
V2="5a47acef-e703-4829-8602-b05cde7f5cbe"; V5="8635223e-6dfe-4082-b0d7-fb164cda3afa"; V6="8555775f-8fc7-4628-921d-cab5567e4ece"; V7="be771951-825b-4de5-b969-9b698b2ee57a"
STAMP="8a1b459d10"; base={"serif":"Fraunces","hand":"Kalam","paper":"#FFFEFA","ink":"#171411","accent":"#DF825F"}
# Instagram organic Reels safe zone: y 220-1440, x 65-1015, right rail x>850 below y 1150
TOPC=dict(left=130,top=228,width=820,height=328); TOPR=dict(left=392,top=240,width=560,height=224); BOT=dict(left=120,top=1130,width=760,height=304)
adds=[]
def stamp(f0,f1,zone,label,word,icon,track=V7,color="#171411"):
    adds.append(dict(type="motion-graphic",assetId=STAMP,trackId=track,startFrame=f0,durationFrames=f1-f0,keepAspectRatio=False,**zone,propertyOverrides=dict(base,label=label,word=word,icon=icon,wordColor=color,wordSize=150)))
def mg(asset,f0,f1,track,zone,**props):
    adds.append(dict(type="motion-graphic",assetId=asset,trackId=track,startFrame=f0,durationFrames=f1-f0,keepAspectRatio=False,**zone,propertyOverrides=dict(base,**props)))
R0=st("repos"); CH=R0+134
stamp(R0,CH,BOT,"five free","DESIGN REPOS","plugin",track=V2)
mg("05db99413e",CH,st("shop"),V7,dict(left=0,top=220,width=1080,height=700),fly=62,stamp=95,hx=565,hy=560,label="5 repos → 1 experiment",word="DESIGN TEST")
stamp(st("shop"),st("shop")+87,TOPC,"the test subject","POMPETTE","person")
stamp(st("shop")+87,st("nicely"),TOPC,"no website yet","BUILD IT NOW","rocket")
stamp(st("nicely"),en("nicely"),TOPR,"Claude + 5 repos","WIREFRAMED","check")
stamp(st("whynot"),st("believe"),TOPC,"one more tool","HIGGSFIELD","video")
stamp(st("believe"),st("swirls"),TOPC,"honestly","CAN'T BELIEVE IT","none")
stamp(st("swirls"),st("splices"),TOPR,"scroll the page","3D SWIRL","video")
mg("4bc1f522a7",st("splices")+7,st("million"),V7,dict(left=440,top=228,width=476,height=281),cellsAt=14,scrollAt=80,tagAt=150)
stamp(st("million"),en("million"),TOPC,"prompt: make it look like a","$2-3M SITE","money")
stamp(st("cracked"),en("cracked"),TOPC,"perfect for","SMALL BUSINESS","person")
stamp(st("spice"),st("cup"),TOPR,"one more item","ORDER PAGE","table")
stamp(st("cup"),en("cup"),TOPR,"it even","RENDERS THE CUP","image")
mg("c2f337e2f2",st("sixty"),st("biz"),V7,dict(left=170,top=228,width=740,height=266),d1=17,d2=148,d3=315,l1="CLAUDE",l2="HIGGSFIELD",l3="YOU + OWNER")
stamp(st("biz"),st("giveyou"),TOPC,"side hustle?","BUSINESS IDEA","rocket")
mg("579fd8cebe",st("giveyou"),st("verdict"),V7,dict(left=140,top=222,width=800,height=304),p1=50,p2=st("m250")+53-st("giveyou"),a1="$1,000",n1="the website",a2="$250",n2="/month upkeep")
V=st("verdict")
adds.append(dict(type="motion-graphic",assetId="f9e0831e72",trackId=V6,startFrame=V,durationFrames=TOTAL-V,keepAspectRatio=False,left=70,top=232,width=260,height=230,propertyOverrides=dict(base,top="COOKED",bottom="CRACKED",tickTop=False,tickAt=54)))
stamp(V+50,TOTAL,dict(left=350,top=240,width=620,height=248),"the verdict","CRACKED","trophy",color="#DF825F")
adds.append(dict(type="motion-graphic",assetId="02e3463232",trackId=V5,startFrame=V+54,durationFrames=min(130,TOTAL-V-54),keepAspectRatio=False,left=0,top=0,width=1080,height=1920,propertyOverrides=dict(paper="#FFFEFA",ink="#171411",accent="#DF825F",extra="#F2C14E",count=70)))
stamp(st("cta"),TOTAL,BOT,"comment","DESIGN","comment",track=V2)
print(json.dumps(adds))
