from multiprocessing.dummy import Process
from unittest import result
from server.blockchain_ubtE3yS import BlockChain
import time 
import json
from pprint import pprint as print
import urllib3
import sys
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

link_client = 'https://b1.ahmetshin.com/static/blockchain.py'

class User:
    def __init__(self, username, password):
        self.start = True
        
        self.username = username
        self.password = password

        self.init = BlockChain(username=self.username, password=self.password, base_url = 'https://b1.ahmetshin.com/restapi/')
        self.init.get_version_file()
        self.hach = self.init.hach_user

        self.do_tasks_value = False

        self.result = self.init.register()
        

        # Проверка монет
        self.check_coins()

    def do_task(self, i):
        id = i['id']
        data_json = i['data_json']
        hash = self.init.get_hash_object(json.dumps(data_json))
        result_hash = self.init.make_hash(hash)

        data = {
            'type_task':'BlockTaskUser_Solution',
            'id':id,
            'hash':result_hash
        }
        print(self.init.send_task(data).json())

    def check_coins(self):
        self.result = self.init.check_coins()
        print(self.result.json())
        self.coins = self.result.json()["coins"] 
        return self.coins   

    def encrypt_message(self, body):
        print(body)
        data = {
            "private_key": body["password"],
            "text": body["message"]
        }
        result = self.init.encrypt(data)
        return result.json()

    def decrypt_message(self, body):
        data = {
            "private_key": body.private_key,
            "encrypted_object": {'action': body.encrypted_object.action, 'curlid': body.encrypted_object.curlid, 'random_key': body.encrypted_object.random_key, 'random_number': body.encrypted_object.random_number, 'secret_text': body.encrypted_object.secret_text}
        }
        result = self.init.decrypt(data)
        print(result.json())
        return result.json()

    def get_tasks(self):
        # получить задачи
        self.result = self.init.get_task().json()
        return self.result

    def get_chains(self):
        self.result = self.init.get_chains()
        return self.result.json()

    def send_coins(self, coins, to_hach):
            self.result = self.init.check_coins()
            print(self.result.json())
            self.data = {
            'type_task':'send_coins',
            'from_hach':self.hach,
            'to_hach': to_hach,
            'count_coins':int(coins)
            }
            self.init.send_task(self.data).json()
            self.get_tasks()

    def send_task(self, data):
        return self.init.send_task(data).json()

    def send_message(self, message, to_hach):
        self.result = self.init.check_coins()
        print(self.result.json())
        self.data = {
        'type_task':'message',
        'from_hach':self.hach,
        'to_hach': to_hach,
        'message': message
        }
        self.init.send_task(self.data).json()
        self.get_tasks()

    
    def do_tasks(self):
        while(self.do_tasks_value):
            timer = time.time()
            time.sleep(2)
            processes = []
            self.result = self.get_tasks()
                # проверяем какие задачи поступили на решение, затем их отправляем 
            if self.result["tasks"]:
                for i in self.result["tasks"]:
                    if(i['status_solution'] == False):
                        self.do_task(i)
                        # processes.append(Process(target = self.do_task, args = (i)))
            
                for count, process in enumerate(processes):
                    print(f'process {count} was started')
                    process.start()
                
                for count, process in enumerate(processes):
                    print(f'process {count} was ended')
                    process.join()

            print(f'Время выполнения {time.time() - timer}')
                

                    
            
    

    



