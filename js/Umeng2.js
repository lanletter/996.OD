
function deviceId(obj)
{
    document.getElementById("DeviceId").innerHTML=obj;
}
function eventWithParameters()
{
    var eventData = new Object();
    eventData.name = "aaa";
    eventData.age = 17;
    MobclickAgent.onEventWithParameters('EventParameters', eventData);
}
function eventWithCounter() {
    var eventCounter = new Object();
    eventCounter.name = "key";
    eventCounter.age = 17;
    MobclickAgent.onEventWithCounter('EventCounter', eventCounter, '12');
}
function onCCEvent()
{
    var eventArray = new Array();
    eventArray[0]="arr1";
    eventArray[1]="arr2";
    eventArray[2]="arr3"
    MobclickAgent.onCCEvent(eventArray,1,"eventlabel");
}