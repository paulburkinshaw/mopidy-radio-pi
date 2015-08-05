***************************************************************************************
Accessing internet using iPhone 5s internet but connect to Mopidy web front end via LAN
***************************************************************************************

To enable this:
	- If you have never tethered to iPhone from pi then:
		- follow instructions here on how to tether raspberry pi to iPhone 5 http://www.vk3erw.com/index.php/16-software/23-raspberry-pi-tethered-to-iphone-5
	- If you have already had tethering working then:
		eth0 interface setup
		====================
		- Edit the interfaces file in /etc/network:
			- Set eth0 (LAN interface) to DHCP 
			- Execute below commands to force DHCP to renew IP on eth0
			- sudo dhclient -r eth0
			- sudo dhclient eth0
			- Execute ifconfig - write down the IP address that has been assigned to eth0
			- Open interfaces again in nano and:
			- Set the eth0 interface to a static IP with the above IP address
			- Set the netmask to 255.255.0.0 (important because at SIG the last 2 subnets can chage but always uses 10.254)
			- Set the gateway to the phones gateway IP (should be 172.20.20.1) - To stop eth0 trying to use the default gateway assigned to it by DHCP	
			- We should now have eth0 set up but internet connectivity will not work yet as the phone is not yet plugged in and tethered
		
		eth1 (iPhone) interface setup
		=============================
		- Turn off wifi on phone
		- Turn on personal hotspot
		- Plug phone into Pi
		- Select No for trust device on phone
		- Execute sudo mkdir /media/iphone (folder may already be there)
		- Execute sudo ifuse /media/iphone
		- Run ifconfig to check iPhone is on eth1 and picking up an IP address etc
		- Test internet connectivity by pinging a website
	- Then:
		

		
