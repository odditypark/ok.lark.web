import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import articleAPI from '@/api/article';
import { Row, Col, Button, Tabs, Divider, Empty } from 'antd';
import ArticleThum from '@/components/article_thum';

import ss from '@/styles/index.less';

const { TabPane } = Tabs;

class Articles extends React.Component {
  state = {
    articles: []
  }

  constructor(props) {
    super(props);
    this.props = props;
  }
  
  componentWillMount() {
    articleAPI[`get_${this.props.type}_thums`]().then(r => {
      if (r.data.errMsg === 'ok') {
	this.setState({ articles: r.data.data });
      }
    })
  }

  render() {
    if (this.state.articles.length === 0) {
      return (
	<div>
	  <div className={ss.empty}>暂无草稿</div>
	  <Divider />
	</div>
      )
    } else {
      return (
	<div>
	  {this.state.articles.map(r => (
	    <ArticleThum key={r._id} title={r.title} id={r._id} type={this.props.type} />)
	  )}
	</div>
      )
    }
  }
};

const Index = props => {
  const { dispatch, stat } = props;

  const callback = (key) => {
    console.log(key);
  }

  const editor = () => {
    router.push('/editor');
  }
  
  return (
    <section className={ss.page}>
      <Row className={ss.top_row} type='flex'>
	<Col span={12}>
	  <p className={ss.title}>我的文章</p>
	</Col>
	<Col className={ss.tools} span={12}>
	  {stat.login === false?'':<Button className={ss.push_article} size='large' onClick={editor}>写文章</Button>}
	</Col>
      </Row>
      <Row>
	<Tabs defaultActiveKey="1" onChange={callback} tabBarGutter={0} animated={false}>
	  <TabPane className={ss.tp} tab="草稿" key="1">
	    {stat.login?
	      <Articles type='draft' />:
	      (<div>
		<div className={ss.empty}>暂无草稿</div>
		<Divider />
	      </div>)
	    }
	  </TabPane>
	  <TabPane className={ss.tp} tab="已发布" key="2">
	    {stat.login?
	      <Articles type='article' />:
	      (<div>
		<div className={ss.empty}>暂无草稿</div>
		<Divider />
	      </div>)
	    }
	  </TabPane>
	</Tabs>
      </Row>
    </section>
  );
}

export default connect(({ modal, login, stat }) => ({
  modal, login, stat
}))(Index);
