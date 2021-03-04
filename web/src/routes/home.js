import React, { Component } from 'react';
import { Card, Button, message } from 'antd';
import { getPetList ,applyForPet, getPetCategory, getOrderByUserId, searchPet } from '../http'
import { base_url } from '../config'
import Detail from '../componet/detail'
const { Meta } = Card;

class allPetList extends Component {
    state = {
        loading: false,
        petList: [],
        showDetailModal: false,
        currentPet: {},
        allPetCategory: [],
        breed_id: ''
    }
    handleSearch = (petName) => {
        searchPet(petName).then(({data: {petList}}) => {
			this.setState({
				petList
			})
		})
    }
    fetchData(categoryId,breed_id) {
        const token = localStorage.getItem('token');
        if(categoryId === 'self'){
            if(!token){
                message.warning("请先登录!");
                return;
            }
            const {id : user_id} = JSON.parse(localStorage.getItem('selfInfo'))
            getOrderByUserId(user_id).then(({data: { petList }}) => {
                this.setState({
                    petList
                })
            }).catch(err => {
                console.log(err)
            })
        }else{
            const category_id = categoryId || "all";
            getPetList(category_id,breed_id).then(({data: { petList }}) => {
                this.setState({
                    petList
                })
            }).catch(err => {
                console.log(err)
            })
        }
        
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            console.log('this.props.match====--',nextProps.match)
            const {id,breed_id} = nextProps.match.params;
            this.fetchData(id,breed_id);
            this.setState({
              breed_id
            })
        } 
    }
    componentDidMount() {
        this.fetchData('all')
        getPetCategory().then(({data: { allPetCategory }}) => {
            this.setState({
                allPetCategory
            })
        })
    }
    applyForPet = (id,status) => {
        const token = localStorage.getItem('token');
        if(!token){ message.warning("请先登录!"); return; }
        const {id : user_id} = JSON.parse(localStorage.getItem('selfInfo'))

        // if(status !== 0){  message.warning("已在认领中,不可重复认领"); return; };

        applyForPet({pet_id: id,user_id}).then(({data: {message: applyForPetRes}}) => {
            message.success(applyForPetRes)
            this.setState({
                petList: this.state.petList.map(pet => {
                    return pet.id === id
                        ? {...pet,status: 1}
                        : pet
                })
            })
        }).catch(err => {
            console.log('applyForPet err===>>',err)
        })
    }
    handlePetDetail = (pet) => {
        console.warn('detail pet =>' ,pet)
        this.setState({
            showDetailModal: true,
            currentPet: pet
        })
    }
    handleModalCancel = () => {
        this.setState({
            showDetailModal: false
        })
    }
    handelApplyForCb = () => {
        const {id,status} = this.state.currentPet;
        this.applyForPet(id,status)
    }
    render() {
        const { petList, showDetailModal, currentPet, allPetCategory, breed_id} = this.state;
        const PetCard = (pet) =>  (
            <Card
                key={pet.id}
                hoverable
                style={{ width: 240,display: 'inline-block',margin: '20px 24px' }}
                actions={
                    [   
                        <Button onClick={() => {this.handlePetDetail(pet)}}>详情</Button>, 
                        <Button onClick={() => {this.applyForPet(pet.id,pet.status)}}>认领</Button>
                    ]
                }
                cover={<img alt="example" src={`${base_url}${pet.image}`} />}
            >
                <Meta title={`${pet.name}`} description={pet.pet_desc || "暂无描述"}/>
            </Card>
        )
        return (
            <div>
               {
                 breed_id == 'know' ? <pre style={{whiteSpace: 'pre-wrap', overflow: 'unset'}}>
                    <br></br>【供选宠物的基本情况】<br></br>

                      √ 已成年<br></br>
                      √ 已绝育<br></br>
                      √ 已免疫<br></br>
                      √ 已完成2月体内外驱虫<br></br>
                      √ 领养前已全身清洁<br></br>
                      √ 没有传染性疾病<br></br>
                      √ 性格温顺<br></br>
                      √ 环境适应力强<br></br>

                      【补充说明】活动选出的宠物都是对新环境适应性很强的，只要有吃有睡，在陌生人面前也会“没心没肺”撒欢的那种，所以7天的暂养对狗狗的影响很小，甚至没有影响；相比之下，它们更需要这7天的陪伴与疼爱。
                      <br></br>
                      当然，救助站里更多的是性格孤僻、担心再次被抛弃、非常需要人类陪伴的狗狗，如果您有意愿和条件长期领养，也可在活动报名表单里选择「长期领养」流浪动物，通过筛选会有志愿者联系您。
                      <br></br>

                      【供选狗狗数量】<br></br>

                      20-50只不等
                      根据每个城市救助站狗狗的情况而定
                      <br></br>

                      【领养家庭要求】<br></br>

                      01/ 仅支持同城中途；<br></br>
                      02/ 有养宠物经验，但现在家里不能有同种类；<br></br>
                      03/ 中途家庭需征得共住的所有家人同意；<br></br>
                      04/ 能接受志愿者在中途前进行家访，并保证所有共住人在场；<br></br>
                      05/ 必须至少能陪伴宠物6小时/天，保证遛狗2次/天；<br></br>
                      06/ 必须每天向我们的工作人员发送视频反馈；<br></br>
                      07/ 签订中途协议，并严格执行协议内容。<br></br>
                      <br></br>

                      【中途流程】
                      <br></br>
                      01/ 将文章分享至朋友圈<br></br>
                      02/ 填写报名表<br></br>
                      03/ 等待筛选结果通知<br></br>
                      04/ 选择宠物<br></br>
                      05/ 预约家访<br></br>
                      06/接狗狗回家， 同时签署中途协议<br></br>
                 </pre> :
                 <div>
                   <Detail  pet={currentPet}  showDetailModal={showDetailModal} onApplyForCb={this.handelApplyForCb} onCancelCb={this.handleModalCancel} ></Detail>
                  {
                      allPetCategory.map(cate => {
                          const petArr = petList.filter(pet => pet.category_id === cate.id);
                          return petArr.length > 0 
                              ? <div className="pet-category" key={cate.id}>
                                  <div  className="pet-category-name">{cate.name}</div>
                                  {petArr.map(item => {  return  PetCard(item)  })}
                              </div>
                              : null
                      })
                  }
                  {petList.length === 0 ? <div className="no-data-desc">暂无数据</div> : null}
                 </div>
               }
              
            </div>
        );
    }
}

export default allPetList;