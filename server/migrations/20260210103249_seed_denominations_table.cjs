// migrations/YYYYMMDDHHMMSS_insert_denominations.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex('denominations').insert([
    {
      name: 'Catholicism-Roman Catholic',
      description: 'The Roman Catholic Church is the largest Christian church, led by the Pope, with a rich tradition of sacraments, liturgy, and global presence.',
      status: 'active'
    },
    {
      name: 'Catholicism-Eastern Catholic',
      description: 'Eastern Catholic Churches are in full communion with the Pope but retain their own liturgical rites, traditions, and governance.',
      status: 'active'
    },
    {
      name: 'Orthodoxy-Eastern Orthodox',
      description: 'The Eastern Orthodox Church emphasizes tradition, liturgy, and the seven ecumenical councils; it is organized into autocephalous regional churches.',
      status: 'active'
    },
    {
      name: 'Orthodoxy-Oriental Orthodox',
      description: 'Oriental Orthodox Churches reject the Council of Chalcedon and maintain ancient Christian traditions, mainly in Egypt, Ethiopia, and Armenia.',
      status: 'active'
    },
    {
      name: 'Protestantism-Anglican',
      description: 'The Anglican Church emerged from the English Reformation, blending Catholic liturgy with Protestant theology and episcopal governance.',
      status: 'active'
    },
    {
      name: 'Protestantism-Lutheran',
      description: 'Lutheran churches follow the teachings of Martin Luther, emphasizing salvation by faith alone and the authority of Scripture.',
      status: 'active'
    },
    {
      name: 'Protestantism-Presbyterian',
      description: 'Presbyterianism is a Reformed tradition governed by elders, emphasizing the sovereignty of God and covenant theology.',
      status: 'active'
    },
    {
      name: 'Protestantism-Methodist',
      description: 'Methodism arose from the teachings of John Wesley, focusing on personal holiness, social justice, and structured spiritual practices.',
      status: 'active'
    },
    {
      name: 'Protestantism-Baptist',
      description: "Baptist churches emphasize believer's baptism, congregational governance, and religious freedom.",
      status: 'active'
    },
    {
      name: 'Protestantism-Reformed',
      description: "Reformed churches follow Calvinist theology, stressing God's sovereignty, predestination, and covenantal living.",
      status: 'active'
    },
    {
      name: 'Protestantism-Pentecostal',
      description: 'Pentecostalism emphasizes the gifts of the Holy Spirit, including speaking in tongues, prophecy, and healing.',
      status: 'active'
    },
    {
      name: 'Protestantism-Non-denominational',
      description: 'Non-denominational churches operate independently of historic denominations, often focusing on personal faith and Bible teaching.',
      status: 'active'
    },
    {
      name: 'Protestantism-Charismatic',
      description: "Charismatic Christians emphasize modern expressions of the Holy Spirit's gifts, similar to Pentecostalism, within traditional churches.",
      status: 'active'
    },
    {
      name: 'Protestantism-Not Listed',
      description: 'A Protestant church or community not categorized under the main listed Protestant denominations.',
      status: 'active'
    },
    {
      name: 'Evangelical-Pentecostal',
      description: 'Evangelical Pentecostals emphasize personal conversion, the authority of Scripture, and the active presence of the Holy Spirit.',
      status: 'active'
    },
    {
      name: 'Evangelical-Non-denominational',
      description: 'Evangelical non-denominational churches focus on personal faith, Bible teaching, and spreading the gospel outside traditional denominations.',
      status: 'active'
    },
    {
      name: 'Evangelical-Charismatic',
      description: "Evangelical Charismatics blend evangelical theology with modern expressions of the Holy Spirit's gifts.",
      status: 'active'
    },
    {
      name: 'Evangelical-Not Listed',
      description: 'An evangelical church not categorized under the main listed evangelical denominations.',
      status: 'active'
    },
    {
      name: 'Adventist-Seventh-day Adventist',
      description: "The Seventh-day Adventist Church observes Saturday as the Sabbath, emphasizes Christ's second coming, and promotes holistic health.",
      status: 'active'
    },
    {
      name: 'Adventist-Mormon',
      description: 'Mormons, or members of The Church of Jesus Christ of Latter-day Saints, follow modern revelations and unique scriptures alongside the Bible.',
      status: 'active'
    },
    {
      name: "Adventist-Jehovah's Witnesses",
      description: "Jehovah's Witnesses emphasize Bible study, evangelism, and the name of God as Jehovah, rejecting certain mainstream Christian doctrines.",
      status: 'active'
    },
    {
      name: 'Adventist-Not Listed',
      description: 'An Adventist-related church or community not categorized under the main listed Adventist denominations.',
      status: 'active'
    },
    {
      name: 'Anabaptist-Mennonite',
      description: 'Mennonites emphasize pacifism, community living, adult baptism, and discipleship following the teachings of Menno Simons.',
      status: 'active'
    },
    {
      name: 'Anabaptist-Amish',
      description: 'Amish communities live simple, traditional lives, emphasizing separation from modern society and strict adherence to Anabaptist principles.',
      status: 'active'
    },
    {
      name: 'Anabaptist-Hutterites',
      description: 'Hutterites live in communal colonies, sharing property and resources, practicing Anabaptist traditions of adult baptism and pacifism.',
      status: 'active'
    },
    {
      name: 'Anabaptist-Not Listed',
      description: 'An Anabaptist church or community not categorized under the main listed Anabaptist denominations.',
      status: 'active'
    },
    {
      name: 'Other-Quakers',
      description: 'Quakers, or the Religious Society of Friends, emphasize simplicity, peace, integrity, and direct experience of God in daily life.',
      status: 'active'
    },
    {
      name: 'Other-Salvation Army',
      description: 'The Salvation Army is a Christian organization focused on social welfare, evangelism, and practical service to the needy.',
      status: 'active'
    },
    {
      name: 'Other-Christian Science',
      description: 'Christian Science emphasizes spiritual healing through prayer and the teachings of Mary Baker Eddy, interpreting the Bible spiritually.',
      status: 'active'
    },
    {
      name: 'Other-Unitarian',
      description: 'Unitarianism focuses on the oneness of God, rejects the Trinity, and encourages reason, freedom of belief, and individual conscience.',
      status: 'active'
    },
    {
      name: 'Other-Not Listed',
      description: 'A Christian denomination or community not categorized under the main listed denominations.',
      status: 'active'
    }
  ]);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex('denominations').del();
}
